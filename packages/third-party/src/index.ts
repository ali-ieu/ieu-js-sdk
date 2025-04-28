import { stringify, parse } from 'querystring'
import { Env, Store } from '@ali-ieu/shared'
import { PKG_NAME, THIRD_PART_LOGIN_TOKEN_URL, THIRD_PART_LOGIN_URL, FISSION_TOKENNAME, VERSION, TOKENNAME, ERROR_CODE } from './const'

import type {
    AirlineLoginParams,
    AirlineType,
    CommonLoginSuccessResponse,
    FissionTokenResponse,
    LingxiLoginParams,
    QQLoginParams,
    SearchString,
    ThirdPartyChannel,
    WeixinLoginParams,
    WeiboLoginParams,
    BiliBiliLoginParams,
} from './types'

function joinSlash(...paths: string[]) {
    return paths.join('/')
}
interface ThirdPartyOptions {
    host: string
    fissionURL?: string
}

interface OAuth2Params {
    client_id: string
    access_code: string
    third_party_channel: ThirdPartyChannel
    airline_type?: AirlineType
    os?: 'ios' | 'android'
    login_type?: 'facebook'
}
class ThirdParty {
    private env: Env
    private store: Store
    static oauth2Params?: OAuth2Params
    static isNeedOauthCall = false
    static isNeedFissionCall = false

    constructor(options: ThirdPartyOptions) {
        this.env = new Env({
            host: options.host,
            fissionURL: options.fissionURL,
        })
        this.store = new Store({
            nameSpace: PKG_NAME,
            version: VERSION,
        })
    }

    private completeURL(path: string, params?: SearchString): string {
        if (!params) {
            return joinSlash(this.env.getHost(), path)
        }
        const searchParams = stringify(params)
        return joinSlash(this.env.getHost(), path) + '?' + searchParams
    }

    private makeTokenKeyFromChannel(channel: ThirdPartyChannel) {
        return channel + ':' + TOKENNAME
    }

    private makeFissionTokenKeyFromChannel(channel: ThirdPartyChannel) {
        return channel + ':' + FISSION_TOKENNAME
    }

    lingxiLogin(params: LingxiLoginParams): void {
        window.location.href = this.completeURL(THIRD_PART_LOGIN_URL['lingxi'], {
            ...params,
            redirectURI: window.location.href,
        })
    }

    airlineLogin(params: AirlineLoginParams): void {
        window.location.href = this.completeURL(THIRD_PART_LOGIN_URL['airline'], {
            ...params,
            redirectURI: window.location.href,
        })
    }
    qqLogin(params: QQLoginParams): void {
        window.location.href = this.completeURL(THIRD_PART_LOGIN_URL['qq'], {
            ...params,
            redirectURI: window.location.href,
        })
    }
    weixinLogin(params: WeixinLoginParams): void {
        window.location.href = this.completeURL(THIRD_PART_LOGIN_URL['weixin'], {
            ...params,
            redirectURI: window.location.href,
        })
    }
    weiboLogin(params: WeiboLoginParams): void {
        window.location.href = this.completeURL(THIRD_PART_LOGIN_URL['weibo'], {
            ...params,
            redirectURI: window.location.href,
        })
    }
    bilibiliLogin(params: BiliBiliLoginParams): void {
        window.location.href = this.completeURL(THIRD_PART_LOGIN_URL['bilibili'], {
            ...params,
            redirectURI: window.location.href,
        })
    }

    logout(channel: ThirdPartyChannel): Promise<void> {
        return new Promise((resolve) => {
            this.store.removeItem(this.makeFissionTokenKeyFromChannel(channel))
            this.store.removeItem(this.makeTokenKeyFromChannel(channel))
            resolve()
        })
    }

    /**
     *
     * @description 判断是否登录
     * @param {ThirdPartyChannel} channel
     * @param {boolean} [isFission=false] 是否是裂变账号
     * @return {*}  {boolean}
     * @memberof ThirdParty
     */
    isLogined(channel: ThirdPartyChannel, isFission = false): boolean {
        const data = this.store.getItem<CommonLoginSuccessResponse>(this.makeTokenKeyFromChannel(channel))
        if (isFission) {
            const FissionData = this.store.getItem<FissionTokenResponse>(this.makeFissionTokenKeyFromChannel(channel))
            return Boolean(FissionData) && Boolean(data)
        }
        return Boolean(data)
    }

    /**
     * 获取裂变账号 token
     */

    getFissionToken(channel: ThirdPartyChannel): Promise<FissionTokenResponse['data']> {
        return new Promise((resolve, reject) => {
            this.getAccessToken(channel)
                .then(({ accessToken, extraData }) => {
                    const openId = extraData.state['openId'] ?? ''
                    if (ThirdParty.isNeedFissionCall) {
                        const xhr = new XMLHttpRequest()
                        const params = {
                            gameId: ThirdParty.oauth2Params?.client_id ?? '',
                            accessToken,
                            thirdPartyType: channel,
                            clientInfo: {},
                            openId,
                        }

                        xhr.open('POST', this.env.getFissionURL())
                        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
                        xhr.send(JSON.stringify(params))
                        xhr.onload = () => {
                            try {
                                const result: FissionTokenResponse = JSON.parse(xhr.responseText)
                                if (result.state.code === 2000000) {
                                    this.store.setItem(
                                        this.makeFissionTokenKeyFromChannel(channel),
                                        result.data,
                                        Date.now() + result.data.expiresIn * 1000,
                                    )
                                    ThirdParty.isNeedFissionCall = false
                                    resolve(result.data)
                                } else {
                                    reject({
                                        code: ERROR_CODE.INVALID_ACCESSTOKEN,
                                        msg: result.state.msg,
                                    })
                                }
                            } catch (error: unknown) {
                                reject({
                                    code: ERROR_CODE.UNKNOWN_ERROR,
                                    msg: (error as Error).message,
                                })
                            }
                        }
                        xhr.onerror = () => {
                            reject({
                                code: ERROR_CODE.NETWORK_ERROR,
                                msg: '网络异常',
                            })
                        }
                    } else {
                        const data = this.store.getItem<FissionTokenResponse['data']>(this.makeFissionTokenKeyFromChannel(channel))
                        if (data) {
                            resolve(data)
                        }
                        reject({
                            code: ERROR_CODE.FISSION_TOKEN_UNAVAILABLE,
                            msg: '无可用的 FissionToken',
                        })
                    }
                })
                .catch(reject)
        })
    }

    /**
     * 获取三方 token，
     */
    getAccessToken(channel: ThirdPartyChannel): Promise<CommonLoginSuccessResponse> {
        return new Promise((resolve, reject) => {
            if (ThirdParty.isNeedOauthCall) {
                const { third_party_channel, client_id, access_code, airline_type } = ThirdParty.oauth2Params as OAuth2Params
                let body = {}
                switch (third_party_channel) {
                    case 'lingxi':
                        body = {
                            client_id,
                            access_code,
                            third_party_channel,
                        }
                        break
                    case 'airline': {
                        body = {
                            client_id,
                            access_code,
                            third_party_channel,
                            airline_type,
                        }
                        break
                    }
                    default:
                        body = {
                            client_id,
                            access_code,
                            third_party_channel,
                        }
                        break
                }

                const xhr = new XMLHttpRequest()
                xhr.open('GET', this.completeURL(THIRD_PART_LOGIN_TOKEN_URL, body))
                xhr.send()
                xhr.onload = () => {
                    try {
                        const data: CommonLoginSuccessResponse = JSON.parse(xhr.responseText)
                        this.store.setItem(this.makeTokenKeyFromChannel(third_party_channel), data, data.expiresIn)
                        ThirdParty.isNeedOauthCall = false
                        resolve(data)
                    } catch (error: unknown) {
                        reject({
                            code: ERROR_CODE.UNKNOWN_ERROR,
                            msg: (error as Error).message,
                        })
                    }
                }
                xhr.onerror = () => {
                    reject({
                        code: ERROR_CODE.NETWORK_ERROR,
                        msg: '网络异常',
                    })
                }
            } else {
                const data = this.store.getItem<CommonLoginSuccessResponse>(this.makeTokenKeyFromChannel(channel))
                if (data) {
                    resolve(data)
                }
                reject({
                    code: ERROR_CODE.ACESS_TOKEN_UNAVAILABLE,
                    msg: '无可用的 AcessToken',
                })
            }
        })
    }
}

function sideEffect() {
    const { client_id, access_code, third_party_channel, airline_type, ...restParams } = parse(window.location.search.slice(1))

    let query = stringify(restParams)

    if (query) {
        query = '?' + query
    }

    // replaceState 在部分场景(iframe等)有异常，添加 try catch 不阻塞代码运行
    try {
        // 删除完应用参数后，拼接新的链接
        history.replaceState(history.state, '', window.location.origin + window.location.pathname + query + window.location.hash)
    } catch (err) {
        console.log(err)
    }

    ThirdParty.isNeedOauthCall = Boolean(access_code && client_id && third_party_channel)
    ThirdParty.isNeedFissionCall = Boolean(access_code && client_id && third_party_channel)
    if (ThirdParty.isNeedOauthCall) {
        ThirdParty.oauth2Params = {
            client_id: client_id as string,
            access_code: access_code as string,
            third_party_channel: third_party_channel as ThirdPartyChannel,
            airline_type: airline_type as AirlineType,
        }
    }
}
sideEffect()

export { ThirdParty }
