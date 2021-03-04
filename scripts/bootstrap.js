/* eslint-disable @typescript-eslint/no-var-requires */
// yarn bootstrap or yarn bootstrap --force
const args = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const path = require('path')
const version = require('../package.json').version

const packagesDir = path.resolve(__dirname, '../packages')
const files = fs.readdirSync(packagesDir)

files.forEach((shortName) => {
    if (!fs.statSync(path.join(packagesDir, shortName)).isDirectory()) {
        return
    }
    const name = `@ali-ieu/${shortName}`
    const pkgPath = path.join(packagesDir, shortName, `package.json`)
    const pkgExists = fs.existsSync(pkgPath)
    if (pkgExists) {
        const pkg = require(pkgPath)
        if (pkg.private) {
            return
        }
    }

    if (args.force || !pkgExists) {
        const json = {
            // TODO: 添加 buildOptions, 添加 global name
            name,
            version,
            description: name,
            main: 'index.js',
            module: `dist/${shortName}.esm-bundler.js`,
            files: [`index.js`, `dist`],
            types: `dist/${shortName}.d.ts`,
            repository: {
                type: 'git',
                url: 'git+git@github.com:ali-ieu/ieu-js-sdk.git',
                directory: `packages/${shortName}`,
            },
            keywords: ['ali-ieu'],
            author: 'EliazTray',
            license: 'MIT',
            bugs: {
                url: 'https://github.com/ali-ieu/ieu-js-sdk/issues',
            },
            homepage: `https://github.com/ali-ieu/ieu-js-sdk/#quickstart`,
            sideEffects: [],
        }
        fs.writeFileSync(pkgPath, JSON.stringify(json, null, 4))
    }

    const readmePath = path.join(packagesDir, shortName, `README.md`)
    if (args.force || !fs.existsSync(readmePath)) {
        fs.writeFileSync(readmePath, `# ${name}`)
    }

    // rollup .d.ts in packages
    const apiExtractorConfigPath = path.join(packagesDir, shortName, `api-extractor.json`)
    if (args.force || !fs.existsSync(apiExtractorConfigPath)) {
        fs.writeFileSync(
            apiExtractorConfigPath,
            `
{
    "extends": "../../api-extractor.json",
    "mainEntryPointFilePath": "./dist/packages/<unscopedPackageName>/src/index.d.ts",
    "dtsRollup": {
        "publicTrimmedFilePath": "./dist/<unscopedPackageName>.d.ts"
    }
}

`.trim(),
        )
    }

    const srcDir = path.join(packagesDir, shortName, `src`)
    const indexPath = path.join(packagesDir, shortName, `src/index.ts`)
    if (args.force || !fs.existsSync(indexPath)) {
        if (!fs.existsSync(indexPath)) {
            if (!fs.existsSync(srcDir)) {
                fs.mkdirSync(srcDir)
            }
            fs.writeFileSync(indexPath, ``)
        }
    }

    // https://overreacted.io/how-does-the-development-mode-work/
    const nodeIndexPath = path.join(packagesDir, shortName, 'index.js')
    if (args.force || !fs.existsSync(nodeIndexPath)) {
        fs.writeFileSync(
            nodeIndexPath,
            `
'use strict'

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/${shortName}.cjs.prod.js')
} else {
    module.exports = require('./dist/${shortName}.cjs.js')
}
    `.trim() + '\n',
        )
    }
})
