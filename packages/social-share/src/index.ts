import { isNative, logError } from '@ali-ieu/shared'
import { EjoySDK, ShareResult, NativeShareParams } from '@ali-ieu/ejoysdk'
import { EventEmitter } from 'events'

interface SocialShareConfig {
    platform?: 'web' | 'native'
    wxConfig?: {
        debug?: boolean
        appId: string
        timestamp: number
        nonceStr: string
        signature: string
        jsApiList: string[]
    }
}

export interface ShareParams {
    title?: string
    message?: string
    link?: string
    /** base64 或者 网络资源地址 */
    medias?: string[]
}

interface FaceBookShareParams extends ShareParams {
    type?: 'messenger' | 'timeline'
}

interface TwitterShareParams extends ShareParams {
    type?: 'messenger' | 'timeline'
}

interface QQShareParams extends ShareParams {
    type?: 'messenger' | 'qzone'
}

interface SinaShareParams extends ShareParams {
    type?: 'weibo'
}

interface WechatShareParams extends ShareParams {
    type?: 'messenger' | 'timeline'
}

class SocialShare {
    private platform: 'web' | 'native'
    private wx: any
    private messager?: EventEmitter

    constructor(config: SocialShareConfig) {
        this.platform = config.platform || (isNative() ? 'native' : 'web')
        if (config.wxConfig) {
            // 配置 wechat
            this.messager = new EventEmitter()
            this.messager.on('wechatShare', (fn) => {
                this._initWxSDK().then(() => {
                    this.wx.config(config.wxConfig)
                    this.wx.ready(() => {
                        fn()
                    })
                })
            })
        }
    }

    private _initWxSDK() {
        return new Promise((resolve: any) => {
            const setWX = () => {
                const oScript = document.createElement('script')
                oScript.type = 'text/javascript'
                oScript.onload = () => {
                    this.wx = window.wx
                    resolve()
                }
                oScript.src = 'https://res.wx.qq.com/open/js/jweixin-1.4.0.js'
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                document.querySelector('head')!.appendChild(oScript)
            }

            if (this.wx) {
                resolve()
            } else if (window.wx) {
                this.wx = window.wx
                resolve()
            } else {
                setWX()
            }
        })
    }

    private convertParams(params: ShareParams): NativeShareParams {
        const result: NativeShareParams = {}
        if (typeof params.link !== 'undefined') {
            result.content_url = params.link
        }
        if (typeof params.medias !== 'undefined') {
            result.media = params.medias.map((c) => {
                if (/^http:?/.test(c)) {
                    return {
                        type: 'image_url',
                        data: c,
                    }
                } else {
                    // as Base64
                    return {
                        type: 'image_data',
                        data: c,
                    }
                }
            })
        }
        if (typeof params.title !== 'undefined') {
            result.title = params.title
        }
        if (typeof params.message !== 'undefined') {
            result.message = params.message
        }
        return result
    }

    FaceBook(shareConfig: FaceBookShareParams): Promise<ShareResult> {
        const shareType = `facebook_share_${shareConfig.type ?? 'messenger'}` as const

        return new Promise<ShareResult>((resolve, reject) => {
            if (this.platform === 'web') {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareConfig.link ?? '')}`)
                resolve({
                    code: 0,
                    msg: '网页分享成功',
                })
            } else {
                // 调用端内
                EjoySDK.share(shareType, this.convertParams(shareConfig), {
                    onSuccess: (result) => {
                        if (result?.code === 0) {
                            resolve(result)
                        } else {
                            reject(result)
                        }
                    },
                    onError: (e) => {
                        reject({
                            code: -1,
                            msg: e.message,
                        })
                    },
                })
            }
        })
    }

    Twitter(shareConfig: TwitterShareParams): Promise<ShareResult> {
        return new Promise((resolve, reject: (reason: ShareResult) => void) => {
            if (this.platform === 'native') {
                if (__DEV__) {
                    logError('暂不支持分享到 twitter')
                }
                reject({
                    code: -1,
                    msg: '暂不支持分享到 twitter',
                })
            } else {
                window.open(`https://twitter.com/intent/tweet?text=${shareConfig.message ?? ''}&url=${shareConfig.link ?? ''}`)
                resolve({
                    code: 0,
                    msg: '网页分享成功',
                })
            }
        })
    }

    QQ(shareConfig: QQShareParams): Promise<ShareResult> {
        const { title = '', message = '', medias = [], link = '', type = 'qzone' } = shareConfig
        const shareType = `qq_share_${type}` as const

        return new Promise<ShareResult>((resolve, reject) => {
            if (this.platform === 'web') {
                let url = ''
                if (shareType === 'qq_share_qzone') {
                    url = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(
                        link,
                    )}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent(message)}&pics=${medias
                        .map(encodeURIComponent)
                        .join('|')}`
                } else {
                    url = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(link)}&title=${encodeURIComponent(
                        title,
                    )}&desc=${encodeURIComponent(message)}&pics=${medias.map(encodeURIComponent).pop() ?? ''}`
                }
                window.open(url)
                resolve({
                    code: 0,
                    msg: '网页分享成功',
                })
            } else {
                // 调用端内
                EjoySDK.share(shareType, this.convertParams(shareConfig), {
                    onSuccess: (result) => {
                        if (result?.code === 0) {
                            resolve(result)
                        } else {
                            reject(result)
                        }
                    },
                    onError: (e) => {
                        reject({
                            code: -1,
                            msg: e.message,
                        })
                    },
                })
            }
        })
    }

    Sina(shareConfig: SinaShareParams): Promise<ShareResult> {
        return new Promise<ShareResult>((resolve, reject) => {
            if (this.platform === 'web') {
                const { link = '', title = '', medias = [] } = shareConfig
                window.open(
                    `https://service.weibo.com/share/share.php?url=${encodeURIComponent(link)}&title=${encodeURIComponent(title)}&pic=${
                        medias.map(encodeURIComponent).pop() ?? ''
                    }`,
                )
                resolve({
                    code: 0,
                    msg: '网页分享成功',
                })
            } else {
                // 调用端内
                const shareType = `sina_share_${shareConfig.type ?? 'weibo'}` as const

                EjoySDK.share(shareType, this.convertParams(shareConfig), {
                    onSuccess: (result) => {
                        if (result?.code === 0) {
                            resolve(result)
                        } else {
                            reject(result)
                        }
                    },
                    onError: (e) => {
                        reject({
                            code: -1,
                            msg: e.message,
                        })
                    },
                })
            }
        })
    }

    // web类型的网页分享没有成功分享和取消分享的回调，应用设计中不要过分依赖此回调！
    WeChat(shareConfig: WechatShareParams): Promise<ShareResult> {
        return new Promise<ShareResult>((resolve, reject) => {
            if (this.platform === 'web') {
                // 微信分享只有微信内置 webview 才有效
                if (/MicroMessenger/i.test(navigator.userAgent)) {
                    if (!this.messager) {
                        if (__DEV__) {
                            logError('[wxConfig] 尚未配置，请参阅文档在初始化时配置')
                        }
                    } else {
                        this.messager.emit('wechatShare', () => {
                            const { link = '', title = '', message, medias = [] } = shareConfig
                            const shareData = {
                                title,
                                desc: message,
                                link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                                imgUrl: medias[0] ?? '',
                            }

                            this.wx.updateAppMessageShareData(shareData)
                            this.wx.updateTimelineShareData(shareData)

                            resolve({
                                code: 0,
                                msg: '分享设置成功',
                            })
                        })
                    }
                } else {
                    reject({
                        code: -2,
                        msg: '请在微信浏览器打开',
                    })
                }
            } else {
                // 调用端内
                const shareType = `wechat_share_${shareConfig.type ?? 'messenger'}` as const

                EjoySDK.share(shareType, this.convertParams(shareConfig), {
                    onSuccess: (result) => {
                        if (result?.code === 0) {
                            resolve(result)
                        } else {
                            reject(result)
                        }
                    },
                    onError: (e) => {
                        reject({
                            code: -1,
                            msg: e.message,
                        })
                    },
                })
            }
        })
    }
}

export { SocialShare }
