import pkg from '../package.json'

// 三方登录模块
export const THIRD_PART_LOGIN_URL = {
    airline: 'api/v2/thirdpartylogin/airline/login',
    lingxi: 'api/v2/thirdpartylogin/lingxi/login',
    qq: 'api/v2/thirdpartylogin/qq/login',
    weixin: 'api/v2/thirdpartylogin/weixin/login',
    weibo: 'api/v2/thirdpartylogin/weibo/login',
}
// 登录异常错误码

export const ERROR_CODE = {
    /** 未知错误 */
    UNKNOWN_ERROR: '4001',
    /** 网络加载异常 */
    NETWORK_ERROR: '5001',
    /** TOKEN 不可用 */
    ACESS_TOKEN_UNAVAILABLE: '6001',
    /** Fission Token 不可用 */
    FISSION_TOKEN_UNAVAILABLE: '6002',
    /** ACCESS_TOKEN 无效 */
    INVALID_ACCESSTOKEN: '7001',
}

export const THIRD_PART_LOGIN_TOKEN_URL = 'api/v2/thirdpartylogin/getAccessTokenByCode'

export const WINDOW_FEATURES = 'menubar=no,width=500,height=600'

export const VERSION = pkg.version
export const PKG_NAME = pkg.name
export const TOKENNAME = 'access_token'
export const FISSION_TOKENNAME = 'fission_token'
