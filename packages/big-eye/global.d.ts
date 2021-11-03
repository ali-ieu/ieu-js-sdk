declare module 'alife-logger'
interface IEnvConf {
    dev: string
    development: string
    test: string
    pre: string
    prod: string
}

type IEnvConfStringKeys = Extract<keyof IEnvConf, string>

interface IInitCustomParam {
    env: IEnvConfStringKeys
    release: string
    pid: string
    c1: string
    // [key: string]: any
}

type ILoggerConf = Omit<IInitCustomParam, 'env'>

interface IEntry {
    targetId: string
    envFlag: IEnvConfStringKeys
    loggerConfig: ILoggerConf
}
