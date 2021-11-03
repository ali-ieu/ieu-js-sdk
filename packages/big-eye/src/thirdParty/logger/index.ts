/* eslint-disable */
const BrowserLogger = require('alife-logger')

// https://help.aliyun.com/document_detail/58655.html?spm=a2c4g.11186623.6.692.70b11ec8EqMjC1#environment
const ENV_CONF: IEnvConf = {
    dev: 'local',
    development: 'local',
    test: 'daily',
    pre: 'pre',
    prod: 'prod',
}
// const DisabledFlag = UMI_ENV === 'dev'
const CONFIG = {
    imgUrl: 'https://arms-retcode.aliyuncs.com/r.png?',
    appType: 'web',
    release: '1.0.0',
    sendResource: true,
    enableLinkTrace: true,
    behavior: true,
    useFmp: true,
    enableSPA: true,
    // disabled: DisabledFlag
}

const initFn = (conf: IInitCustomParam) => {
    if (Object.prototype.toString.call(conf) !== '[object Object]') {
        console.error('BigEye config require object type')
        return
    }
    const { env, release, pid, c1 } = conf
    if (![release, env, pid, c1].every((x) => x)) {
        console.error('BigEye loggerConfig require object type includes env, release, pid, c1. c1 is for activity name.')
        return
    }
    const _conf = {
        environment: ENV_CONF[env],
    }
    return BrowserLogger.singleton({ ...CONFIG, ...conf, ..._conf })
}

export default initFn
