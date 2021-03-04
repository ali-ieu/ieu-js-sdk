# Airline 接入

目前 Airline 接入有两种场景
- [Airline 接入](#airline-接入)
  - [配置](#配置)
  - [具体接入](#具体接入)
    - [场景 1: 获取 airline accessToken](#场景-1-获取-airline-accesstoken)
    - [场景 2: 获取 ariline fission_token](#场景-2-获取-ariline-fission_token)


## 配置

| 配置项     | 日常                                                                                                                                     | 预发                                                                                                                                     | 线上                                                                                                                         |
|------------|------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| fissionURL | http://sapi19.game.alibaba.net/api/tplogin/login/thirdparty                                                                              | http://sapi-pre.aligames.com/api/tplogin/login/thirdparty                                                                                | https://sapi.aligames.com/api/tplogin/login/thirdparty                                                                       |
| host       | qookka: pre-util-server.qookkagames.com<br>  sialia: pre-util-server.sialiagames.com.tw<br>oriental: pre-util-server.orientalgame.com.tw | qookka: pre-util-server.qookkagames.com<br>  sialia: pre-util-server.sialiagames.com.tw<br>oriental: pre-util-server.orientalgame.com.tw | qookka: util-server.qookkagames.com<br>  sialia: util-server.sialiagames.com.tw<br>oriental: util-server.orientalgame.com.tw |

## 具体接入

### 场景 1: 获取 airline accessToken

- step1 初始化配置

**初始化配置时**需要根据当前所属环境以及**品牌**接入对应环境的域名

```ts
// lib.ts
import { ThirdParty } from 'path/to/sdkjs'
const thirdParty = new ThirdParty({
    /* TODO: 预发环境, 发布线上替换成 util-server.qookkagames.com */
    host: 'pre-util-server.qookkagames.com',
})

export { thirdParty }
```

- step2 在视图层注册登录相关事件

**不同的品牌需要使用不同的 airline_type**

```ts
// unlogin.tsx
import { thirdParty } from 'path/to/lib.ts'

function Login() {
    const isLogined = thirdParty.isLogined('airline')
    const handleLogin = () => {
        // 拉起品牌 ariline 三方登录
        thirdParty.airlineLogin({
            client_id: 'your gameId',
            airline_type: 'qookkka'
        })
    }
    return (
        <div>
            { !isLogined ? <button onClick={handleLogin}>登录</button> : '已登录'}
        </div>
    )
}
```

- step3 获取三方 accessToken

```ts
// request.ts
// 应用中可能的网络请求处理模块
import { thirdParty } from 'path/to/lib'

try {
    const { accessToken } = await thirdParty.getAccessToken('airline')
} catch (e) {
    // 获取 token 失败 可以根据 e.code 做特殊业务处理
}

```

### 场景 2: 获取 ariline fission_token

- step1 初始化配置

**初始化配置时**需要根据当前所属环境以及**品牌**接入对应环境的域名

```ts
// lib.ts
import { ThirdParty } from 'path/to/sdkjs'
const thirdParty = new ThirdParty({
    /* TODO: 预发环境, 发布线上替换成 util-server.qookkagames.com */
    host: 'pre-util-server.qookkagames.com',
})

export { thirdParty }
```

- step2 在视图层注册登录相关事件

**不同的品牌需要使用不同的 airline_type**

```ts
// unlogin.tsx
import { thirdParty } from 'path/to/lib.ts'

function Login() {
    const isLogined = thirdParty.isLogined('airline', true)
    const handleLogin = () => {
        // 拉起品牌 ariline 三方登录
        thirdParty.airlineLogin({
            client_id: 'your gameId',
            airline_type: 'qookkka'
        })
    }
    return (
        <div>
            { !isLogined ? <button onClick={handleLogin}>登录</button> : '已登录'}
        </div>
    )
}
```

- step3 获取三方 accessToken

```ts
// request.ts
// 应用中可能的网络请求处理模块
import { thirdParty } from 'path/to/lib'

try {
    const { token } = await thirdParty.getFissionToken('airline')
} catch (e) {
    // 获取 token 失败 可以根据 e.code 做特殊业务处理
}

```
