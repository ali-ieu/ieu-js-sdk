/**
 * airline 接入支持的类型
 */
export type AirlineType = 'qookka' | 'oriental' | 'sialia'
export interface AirlineLoginParams {
    client_id: string
    airline_type: AirlineType
    [k: string]: string | number
}
export interface LingxiLoginParams {
    client_id: string
    os: string
    [k: string]: string | number
}

export interface QQLoginParams {
    client_id: string
    /** 默认为 get_user_info */
    scope?: string
    /**
     * 使用 mobile 端样式展示
     */
    display?: 'mobile'
    [k: string]: any
}

export interface WeixinLoginParams {
    client_id: string
    /** 默认为 snsapi_base，可选 snsapi_userinfo */
    scope?: string
    [k: string]: any
}
export interface WeiboLoginParams {
    client_id: string
    /** 默认为 all */
    scope?: string
    /**
     * default: 默认的授权页面，适用于web浏览器
     * mobile: 移动终端的授权页面，适用于支持html5的手机
     * wap: wap版授权页面，适用于非智能手机
     * client: 客户端版本授权页面，适用于PC桌面应用
     */
    display?: 'default' | 'mobile' | 'wap' | 'client'
    [k: string]: any
}

export type ThirdPartyChannel = 'airline' | 'lingxi' | 'weixin'

export interface CommonLoginSuccessResponse {
    /** 三方登录 token */
    accessToken: string
    expiresIn: number
    thirdPartyChannel: ThirdPartyChannel
    extraData: {
        state: {
            [k: string]: string
        }
        [k: string]: any
    }
}

export interface FissionTokenResponse {
    id: string
    data: {
        /**
         * 裂变 token
         */
        token: string
        /**
         * token 失效时间，3600* 24 秒
         */
        expiresIn: number
        openId: string
        uid: string
        thirdPartyUid: string
        thirdPartyType: string
        thirdPartyInfo: {
            nickname: string
            avatar: string
        }
    }
    state: {
        code: number
        msg: string
        desc: string
        subCode: number
    }
}

export type SearchString = {
    [k: string]: any
}
