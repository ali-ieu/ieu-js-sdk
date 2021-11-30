# IEU Javascript SDK

## Documention

[https://ali-ieu.github.io/ieu-js-sdk/](https://ali-ieu.github.io/ieu-js-sdk/)

## Usage
### install
```shell
# npm
npm install @ali-ieu/ieu-js-sdk
# yarn
yarn add @ali-ieu/ieu-js-sdk
```
### usage
```javascript
import { EjoySDK } from '@ali-ieu/ieu-js-sdk'

EjoySDK.getStartupData({
    onSuccess: (data) => console.info(data),
    onError: (error) => console.error(error),
});
```

## EjoySDK API
```javascript
    interface APIParams {
        args?: any;
        onSuccess?: (res: any) => void;
        onError?: (error: any) => void;
    }

    /**
     * 同步调端接口，属于底层基础api。可以调用不在api列表的其他可用lua接口
     * @param name 方法名
     * @param params 见APIParams类型
     */
    callSync(name: string, params?: APIParams): void;
    /**
     * 异步调端接口，属于底层基础api。可以调用不在api列表的其他可用lua接口
     * 这里的同步异步指Lua是异步逻辑然后回调js还是同步逻辑然后回调js, 一般对接口时找客户端同学确认。
     * @param name 方法名
     * @param params 见APIParams类型
     */
    callAsync(name: string, params?: APIParams): void;
    /**
     * 获取应用初始化的信息
     */
    getStartupData(params: Pick<APIParams, 'onSuccess' | 'onError'>): void;
    /** 调用端内分享功能 */
    share(shareType: ShareType, shareParams: NativeShareParams, params: Pick<APIParams, 'onSuccess' | 'onError'>): void;
    /** 检查某种分享方式是否被支持 */
    checkShareType(types: ShareType[], params: Pick<APIParams, 'onSuccess' | 'onError'>): void;
    /** 设置 webview 透明背景 */
    transparentBackground(params?: Pick<APIParams, 'onSuccess' | 'onError'>): void;
    /** 关闭 webview */
    closeBrowser(): void;
    /** 是否端内外 */
    isAliHYApp(): boolean;
    /**
     * 异步notifyLua
     * 这里的同步异步指Lua是异步逻辑然后回调js还是同步逻辑然后回调js, 一般对接口时找客户端同学确认。
     * @param params 见APIParams类型
     */
    notifyLuaAsync(params: APIParams): void;
    /**
     * 同步notifyLua
     * 这里的同步异步指Lua是异步逻辑然后回调js还是同步逻辑然后回调js, 一般对接口时找客户端同学确认。
     * @param params 见APIParams类型
     */
    notifyLuaSync(params: APIParams): void;
    /**
     * 开启WebView调试
     */
    enableDebug(): void;
    /**
     * 是否展示右上角关闭按钮
     * @param show 是否展示
     */
    showCloseButton(show: boolean): void;
```

## License

Released under [MIT License](./LICENSE).
