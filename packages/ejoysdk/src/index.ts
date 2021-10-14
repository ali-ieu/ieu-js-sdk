import { isNative } from '@ali-ieu/shared'
import { EventEmitter } from 'events'

type NativeResult = {
    error?: any
    /** 正常时 */
    retval?: any
}

interface Params {
    /** method name */
    name: string
    args?: any
}

interface BaseConfig {
    share_support_platform: {
        [k in ShareType]?: boolean
    }
}

export interface NativeShareParams {
    /** 标题 */
    title?: string
    message?: string
    /** 分享链接地址 */
    content_url?: string
    media?: ShareMedia[]
}

type ShareMedia = {
    /** image_url => 图片路径, image_data => 图片 base64 */
    type: 'image_url' | 'image_data'
    // type: LiteralUnion<'image_url' | 'image_data', string>;
    data: string
}

type BaseShareType = 'timeline' | 'messenger'
type Channel = 'wechat' | 'facebook'

/** 支持的分享类型 */
export type ShareType = `${Channel}_share_${BaseShareType}` | 'qq_share_messenger' | 'qq_share_qzone' | 'sina_share_weibo'

export type ShareResult = {
    /** 0 表示分享成功，其他表示失败 */
    code: number
    /** 分享状态相关描述 */
    msg: string
}

/**
 * 平台分享的返回体
 */
export type ShareSupportInfo =
    | boolean
    | {
          /** --用户手机上是否有安装对应平台的客户端 */
          has_installed: boolean
          /** --游戏是否有配置对应平台的分享参数 */
          has_share_infos: boolean
          /** --友盟sdk是否支持对应平台分享 */
          is_support: boolean
      }

/**
 * EjoySDK 实例
 *
 */
class SDK {
    messager: EventEmitter
    eventsId: string

    constructor() {
        if (!window.ejoysdk) {
            // Webview 通过触发此回调来传递消息
            window.ejoysdk = {
                nativeCallback: this.nativeCallback,
            }
        }
        this.messager = new EventEmitter()
        this.eventsId = '1000'
    }

    private genID(): string {
        this.eventsId = String(Number(this.eventsId) + 1)
        return this.eventsId
    }

    private getPhoneType() {
        const ua = navigator.userAgent
        const isIOS = /iPad|iPhone|iPod/i.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
        if (/android/i.test(ua)) {
            return 'android'
        } else if (isIOS) {
            return 'ios'
        }
        return 'other'
    }

    private native(params: Params, callback: (err: Error | null, result?: any) => void) {
        const eventsId = this.genID()
        this.messager.once(eventsId, (result: NativeResult) => {
            // 注册 分发回去
            if (result.error) {
                callback(new Error(result.error))
                return
            }
            try {
                // 如果是可以反序列化的字符串，就反序列化回去
                callback(null, JSON.parse(result.retval))
            } catch (e) {
                // 否则，原样返回
                callback(null, result.retval)
            }
        })
        // 不在支持的客户端环境
        if (!isNative()) {
            this.nativeCallback(eventsId, { error: '不被支持的 webview 环境' })
            return
        }

        const type = this.getPhoneType()
        switch (type) {
            case 'android':
                {
                    const defaultValue = JSON.stringify({
                        id: eventsId,
                        name: params.name,
                        args: params.args,
                        asyncCall: true,
                    })
                    if (params.name === 'notifyLua') {
                        // 安卓事件异步发送
                        prompt('jsinterface://', defaultValue)
                    } else {
                        // 使用同步阻塞的方式拿到结果
                        const resultText = prompt('jsinterface://', defaultValue)
                        const result = resultText ? JSON.parse(resultText) : {}
                        this.nativeCallback(eventsId, result)
                    }
                }
                break
            case 'ios':
                // ios 事件发送
                {
                    const query = {
                        id: eventsId,
                        name: params.name,
                        args: params.args,
                        asyncCall: params.name === 'notifyLua',
                    }
                    const queryString = encodeURIComponent(JSON.stringify(query))

                    const webViewJSinterface = window?.['webkit']?.['messageHandlers']?.['jsinterface']

                    if (webViewJSinterface) {
                        // WKWebView, iOS 8.0+
                        webViewJSinterface.postMessage(queryString)
                    } else {
                        // UIWebView, iOS 8.0-
                        let iframe: HTMLIFrameElement | null = document.createElement('iframe')
                        iframe.style.display = 'none'
                        iframe.src = `jsinterface:///?${queryString}`
                        document.documentElement.appendChild(iframe)
                        iframe.parentNode && iframe.parentNode.removeChild(iframe)
                        iframe = null
                    }
                }
                break
            default:
                // 不被支持的方式
                this.nativeCallback(eventsId, { error: '当前设备不支持' })
                break
        }
    }

    nativeCallback = (id: string, result: NativeResult): void => {
        this.messager.emit(id, result)
    }

    /**
     * 获取应用初始化的信息
     */
    getStartupData(_: Record<string, any>, callback: (err: Error | null, result?: BaseConfig) => void): void {
        this.native({ name: 'getStartupData', args: {} }, callback)
    }

    /** 调用端内分享功能 */
    share(shareType: ShareType, shareParams: NativeShareParams, callback: (err: Error | null, result?: ShareResult) => void): void {
        this.native(
            {
                name: 'notifyLua',
                args: {
                    chl: 'social',
                    type: shareType,
                    params: shareParams,
                },
            },
            callback,
        )
    }

    /** 检查某种分享方式是否被支持 */
    checkShareType(types: ShareType[], callback: (err: Error | null, result?: ShareSupportInfo[]) => void): void {
        this.native(
            {
                name: 'notifyLua',
                args: {
                    chl: 'lua_call',
                    syncCall: true,
                    params: { module: 'ejoysdk_lua.social.ejoysdk_social', func: 'is_support', params: types },
                },
            },
            callback,
        )
    }

    /** 设置 webview 透明背景 */
    transparentBackground(_: Record<string, any>, callback: (err: Error | null, result?: any) => void): void {
        this.native(
            {
                name: 'transparentBackground',
                args: {},
            },
            callback,
        )
    }

    /** 关闭 webview */
    closeWebview(_: Record<string, any>, callback: (err: Error | null, result?: any) => void): void {
        this.native(
            {
                name: 'closeBrowser',
                args: {},
            },
            callback,
        )
    }

    /** 是否端内外 */
    isAliHYApp(): boolean {
        let isAliHYApp = false
        const myUA = navigator.userAgent
        if (myUA && myUA.indexOf('HYSDK') > 0) {
            isAliHYApp = true
        }
        if (window['webkit'] && window['webkit']['messageHandlers'] && window['webkit']['messageHandlers']['jsinterface']) {
            // 此为ios特有，如果存在此对象，可以主动判断为端内
            isAliHYApp = true
        }
        return isAliHYApp
    }
}

// 单实例
const EjoySDK = new SDK()

export { EjoySDK }
