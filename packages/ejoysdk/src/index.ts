import { isNative } from '@ali-ieu/shared'
import { EventEmitter } from 'events'

type NativeResult = {
    error?: any
    /** 正常时 */
    retval?: any
}

interface APIParams {
    args?: any
    onSuccess?: (res: any) => void
    onError?: (error: any) => void
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

    private getDeviceType() {
        const ua = navigator.userAgent
        const isIOS = /iPad|iPhone|iPod/i.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
        if (/android/i.test(ua)) {
            return 'android'
        } else if (isIOS) {
            return 'ios'
        } else if (/window/i.test(ua)) {
            return 'PC'
        }
        return 'other'
    }

    /**
     *
     * @param name 方法名
     * @param asyncCall lua异步接口是否异步回调js。false的话，Promise可立马resolve，结果是假结果
     * @param params js传的入参
     * @returns
     */
    private native(name: string, asyncCall: boolean, params?: APIParams) {
        const eventsId = this.genID()
        this.messager.once(eventsId, (result: NativeResult) => {
            // 注册 分发回去
            if (result.error) {
                if (params?.onError) {
                    params.onError(new Error(result.error))
                } else {
                    console.error('call native err: ' + JSON.stringify(result.error))
                }
                return
            }
            if (params?.onSuccess) {
                try {
                    // 如果是可以反序列化的字符串，就反序列化回去
                    params.onSuccess(JSON.parse(result.retval))
                } catch (e) {
                    // 否则，原样返回
                    params.onSuccess(result.retval)
                }
            }
        })
        // 不在支持的客户端环境
        if (!isNative()) {
            this.nativeCallback(eventsId, { error: '不被支持的 webview 环境' })
            return
        }

        const protocolStr = JSON.stringify({
            id: eventsId,
            name: name,
            args: params?.args,
            asyncCall,
        })
        const type = this.getDeviceType()
        switch (type) {
            case 'android':
                {
                    if (name === 'notifyLua') {
                        // 安卓事件异步发送
                        prompt('jsinterface://', protocolStr)
                    } else {
                        // 使用同步阻塞的方式拿到结果
                        const resultText = prompt('jsinterface://', protocolStr)
                        const result = resultText ? JSON.parse(resultText) : {}
                        this.nativeCallback(eventsId, result)
                    }
                }
                break
            case 'ios':
                // ios 事件发送
                {
                    const queryString = encodeURIComponent(protocolStr)

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
            case 'PC':
                {
                    const queryString = encodeURIComponent(protocolStr)
                    window.chrome.webview.postMessage(queryString)
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
     * 同步调端接口，属于底层基础api。可以调用不在api列表的其他可用lua接口
     * @param name 方法名
     * @param params 见APIParams类型
     */
    public callSync(name: string, params?: APIParams) {
        this.native(name, false, params)
    }

    /**
     * 异步调端接口，属于底层基础api。可以调用不在api列表的其他可用lua接口
     * 这里的同步异步指Lua是异步逻辑然后回调js还是同步逻辑然后回调js, 一般对接口时找客户端同学确认。
     * @param name 方法名
     * @param params 见APIParams类型
     */
    public callAsync(name: string, params?: APIParams) {
        this.native(name, true, params)
    }

    /**
     * 获取应用初始化的信息
     */
    public getStartupData(params: Pick<APIParams, 'onSuccess' | 'onError'>) {
        this.callSync('getStartupData', params)
    }

    /** 调用端内分享功能 */
    public share(shareType: ShareType, shareParams: NativeShareParams, params: Pick<APIParams, 'onSuccess' | 'onError'>): void {
        this.callAsync('notifyLua', {
            args: {
                chl: 'social',
                type: shareType,
                params: shareParams,
            },
            ...params,
        })
    }

    /** 检查某种分享方式是否被支持 */
    public checkShareType(types: ShareType[], params: Pick<APIParams, 'onSuccess' | 'onError'>): void {
        this.callAsync('notifyLua', {
            args: {
                chl: 'lua_call',
                syncCall: true,
                params: { module: 'ejoysdk_lua.social.ejoysdk_social', func: 'is_support', params: types },
            },
            ...params,
        })
    }

    /** 设置 webview 透明背景 */
    public transparentBackground(params?: Pick<APIParams, 'onSuccess' | 'onError'>) {
        this.callSync('transparentBackground', params)
    }

    /** 关闭 webview */
    public closeBrowser() {
        this.callSync('closeBrowser')
    }

    /** 是否端内外 */
    public isAliHYApp(): boolean {
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

    /**
     * 异步notifyLua
     * 这里的同步异步指Lua是异步逻辑然后回调js还是同步逻辑然后回调js, 一般对接口时找客户端同学确认。
     * @param params 见APIParams类型
     */
    public notifyLuaAsync(params: APIParams) {
        this.callAsync('notifyLua', params)
    }

    /**
     * 同步notifyLua
     * 这里的同步异步指Lua是异步逻辑然后回调js还是同步逻辑然后回调js, 一般对接口时找客户端同学确认。
     * @param params 见APIParams类型
     */
    public notifyLuaSync(params: APIParams) {
        this.callSync('notifyLua', params)
    }

    /**
     * 开启WebView调试
     */
    public enableDebug() {
        this.callSync('enableDebug')
    }

    /**
     * 是否展示右上角关闭按钮
     * @param show 是否展示
     */
    public showCloseButton(show: boolean) {
        this.callSync('nativeAction', {
            args: {
                showCloseButton: show,
            },
        })
    }
}

// 单实例
const EjoySDK = new SDK()

export { EjoySDK }
