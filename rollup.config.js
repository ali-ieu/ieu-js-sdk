/* eslint-disable @typescript-eslint/no-var-requires */
import { terser } from 'rollup-plugin-terser'
import typescript2 from 'rollup-plugin-typescript2'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import nodeResolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import path from 'path'
import chalk from 'chalk'

// 构建的时候需要指定 target
if (!process.env.TARGET) {
    throw new Error('TARGET package must be specified via --environment flag.')
}

const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, process.env.TARGET)
const name = path.basename(packageDir)
const resolve = (p) => path.resolve(packageDir, p)
const pkg = require(resolve(`package.json`))
const packageOptions = pkg.buildOptions || {}

// ensure TS checks only once for each build
let hasTSChecked = false

const outputConfigs = {
    // for native es module
    'esm-bundler': {
        file: resolve(`dist/${name}.esm-bundler.js`),
        format: `es`,
    },
    // for browser es module(need rollup externals)
    'esm-browser': {
        file: resolve(`dist/${name}.esm-browser.js`),
        format: `es`,
    },
    // for commonjs
    'cjs': {
        file: resolve(`dist/${name}.cjs.js`),
        format: `cjs`,
    },
    // for iife(script load, need rollup externals)
    'global': {
        file: resolve(`dist/${name}.global.js`),
        format: `iife`,
    },
}

const defaultFormats = ['esm-bundler', 'cjs']
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(',')
const packageFormats = inlineFormats || packageOptions.formats || defaultFormats

const packageConfigs = process.env.PROD_ONLY ? [] : packageFormats.map((format) => createConfig(format, outputConfigs[format]))

if (process.env.NODE_ENV === 'production') {
    packageFormats.forEach((format) => {
        // 'iife' 或者 esm-browser  需要添加混淆版本
        if (/^(global|esm-browser)/.test(format)) {
            packageConfigs.push(createProductionConfig(format, true))
        }
        if (format === 'cjs') {
            packageConfigs.push(createProductionConfig(format))
        }
    })
}

export default packageConfigs

function createConfig(format, output, plugins = []) {
    if (!output) {
        console.log(chalk.yellow(`invalid format: "${format}"`))
        process.exit(1)
    }

    output.sourcemap = !!process.env.SOURCE_MAP
    output.externalLiveBindings = false

    const isBrowserESMBuild = /esm-browser/.test(format)
    const isBundlerESMBuild = /esm-bundler/.test(format)
    const isGlobalBuild = /global/.test(format)
    const isProduction = /prod/.test(output.file)

    // 如果是 iife 的构建，需要添加全局变量的名称
    if (isGlobalBuild) {
        output.name = packageOptions.name
    }

    const shouldEmitDeclarations = process.env.TYPES != null && !hasTSChecked

    const tsPlugin = typescript2({
        check: process.env.NODE_ENV === 'production' && !hasTSChecked,
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        // cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
        tsconfigOverride: {
            compilerOptions: {
                sourceMap: output.sourcemap,
                declaration: shouldEmitDeclarations,
                declarationMap: shouldEmitDeclarations,
                // preserved to be handler on browser target
                target: 'ES5',
            },
            exclude: ['**/__tests__'],
        },
        clean: true,
    })
    // we only need to check TS and generate declarations once for each build.
    // it also seems to run into weird issues when checking multiple times
    // during a single build.
    hasTSChecked = true

    const entryFile = 'src/index.ts'

    // esm bundler & cjs format need external dependencies and peerDependencies
    const external =
        isGlobalBuild || isBrowserESMBuild
            ? []
            : [
                  ...Object.keys(pkg.dependencies || {}),
                  ...Object.keys(pkg.peerDependencies || {}),
                  /** node built-ins for esm-bundle */ 'events',
                  'querystring',
              ]

    return {
        input: resolve(entryFile),
        external,
        plugins: [nodePolyfills(), nodeResolve(), json(), createReplacePlugin(isProduction, isBundlerESMBuild), tsPlugin, ...plugins],
        output,
        onwarn: (msg, warn) => {
            if (!/Circular/.test(msg)) {
                warn(msg)
            }
        },
        treeshake: {
            moduleSideEffects: false,
        },
    }
}

function createReplacePlugin(isProduction, isBundlerESMBuild) {
    return replace({
        preventAssignment: true,
        __DEV__: isBundlerESMBuild
            ? // esm bundler 交给 使用方 的打包工具 去处理
              '(process.env.NODE_ENV === "development")'
            : !isProduction,
    })
}

function createProductionConfig(format, needMinify = false) {
    return createConfig(
        format,
        {
            file: outputConfigs[format].file.replace(/\.js$/, '.prod.js'),
            format: outputConfigs[format].format,
        },
        needMinify
            ? [
                  // https://github.com/terser/terser#compress-options
                  terser({
                      module: /^esm/.test(format),
                      compress: {
                          ecma: 2015,
                          pure_getters: true,
                      },
                      safari10: true,
                  }),
              ]
            : [],
    )
}
