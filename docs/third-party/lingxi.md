# 国内灵犀用户中心

目前接入国内灵犀用户中心有两种业务场景

[[toc]]

## 配置

| 配置项     | 日常                                                        | 预发                                                      | 线上                                                   |
| ---------- | ----------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------ |
| fissionURL | http://sapi19.game.alibaba.net/api/tplogin/login/thirdparty | http://sapi-pre.aligames.com/api/tplogin/login/thirdparty | https://sapi.aligames.com/api/tplogin/login/thirdparty |
| host       | pre-util-server.lingxigames.com                             | pre-util-server.lingxigames.com                           | util-server.lingxigames.com                            |

### 场景 1: 获取灵犀用户中心的 accessToken

#### Step1. 初始化配置

**初始化配置时**需要根据当前联调环境接入对应环境的域名, 参考[域名列表](#配置)。

::: warning 注意
上线时，配置都得使用**线上**
:::

```ts
// lib.ts
import { ThirdParty } from '@ali-ieu/ieu-js-sdk'
const thirdParty = new ThirdParty({
    host: 'pre-util-server.lingxigames.com',
})

export { thirdParty }
```

#### Step2. 在视图层注册登录相关事件

一个可能的例子如下，在登录时显示已登录，未登录是展示登录按钮。

```tsx
// unlogin.tsx
import { thirdParty } from 'path/to/lib.ts'

function Login() {
    /** 先判断是否登录 */
    const isLogined = thirdParty.isLogined('lingxi')
    const handleLogin = () => {
        // 拉起 lingxi 三方登录
        thirdParty.lingxiLogin({
            client_id: '替换成应用的client_id',
            os: 'ios', // 'ios' | 'android'
        })
    }
    return <div>{!isLogined ? <button onClick={handleLogin}>登录</button> : '已登录'}</div>
}
```

#### Step3. 获取三方 accessToken

::: warning 注意
三方登录在初次一般会有一个页面跳转的过程，所以在三方网站登录成功时，回调回来的时候，应用重新加载了, 所以需要保证
`getAccessToken` 的调用是在应用初始化时，而不是在某个按钮的回调事件中。
:::

```ts
// request.ts
// 网络请求处理模块
import { thirdParty } from 'path/to/lib'

try {
    const { accessToken } = await thirdParty.getAccessToken('lingxi')
} catch (e) {
    console.error(e)
    // 一般无需处理，有特殊业务需求可根据 e.code 自行处理
}
```

### 场景 2: 获取灵犀用户中心的 fissionToken

和[接入 accessToken](#场景-1-获取灵犀用户中心的-accesstoken)类似，是另一种意义上的 accessToken。

#### Step1. 初始化配置

**初始化配置时**需要根据当前联调环境接入对应环境的域名, 参考[域名列表](#配置)。
**需要传入 fissionURL**

::: warning 注意
上线时，配置都得使用**线上**
:::

```ts
// lib.ts
import { ThirdParty } from '@ali-ieu/ieu-js-sdk'
const thirdParty = new ThirdParty({
    host: 'pre-util-server.lingxigames.com',
    fissionURL: 'http://sapi19.game.alibaba.net/api/tplogin/login/thirdparty',
})

export { thirdParty }
```

#### Step2. 在视图层注册登录相关事件

```tsx
// unlogin.tsx
import { thirdParty } from 'path/to/lib.ts'

function Login() {
    const isLogined = thirdParty.isLogined('lingxi', true)
    const handleLogin = () => {
        // 拉起 lingxi 三方登录
        thirdParty.lingxiLogin({
            client_id: '替换成应用的client_id',
            os: 'your os platform', // 'ios' | 'android'
        })
    }
    return <div>{!isLogined ? <button onClick={handleLogin}>登录</button> : '已登录'}</div>
}
```

#### Step3. 获取 fission token

::: warning 注意
三方登录在初次一般会有一个页面跳转的过程，所以在三方网站登录成功时，回调回来的时候，应用重新加载了, 所以需要保证
`getAccessToken` 的调用是在应用初始化时，而不是在某个按钮的回调事件中。
:::

```ts
// request.ts
// 网络请求处理模块
import { thirdParty } from 'path/to/lib'

try {
    const { token } = await thirdParty.getFissionToken('lingxi')
} catch (e) {
    // 一般无需处理，有特殊业务需求可根据 e.code 自行处理
}
```
