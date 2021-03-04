# lingxi 接入

目前 lingxi 接入有两种场景
- [lingxi 接入](#lingxi-接入)
  - [配置](#配置)
  - [具体接入](#具体接入)
    - [场景 1: 获取 lingxi accessToken](#场景-1-获取-lingxi-accesstoken)
    - [场景 2: 获取 lingxi fission_token](#场景-2-获取-lingxi-fission_token)


## 配置

| 配置项     | 日常                                                        | 预发                                                      | 线上                                                   |
|------------|-------------------------------------------------------------|-----------------------------------------------------------|--------------------------------------------------------|
| fissionURL | http://sapi19.game.alibaba.net/api/tplogin/login/thirdparty | http://sapi-pre.aligames.com/api/tplogin/login/thirdparty | https://sapi.aligames.com/api/tplogin/login/thirdparty |
| host       | pre-util-server.lingxigames.com                             | pre-util-server.lingxigames.com                           | util-server.lingxigames.com                            |


## 具体接入

### 场景 1: 获取 lingxi accessToken

1. step1 初始化配置

**初始化配置时**需要根据当前所属环境接入对应环境的域名

```ts
// lib.ts
import { ThirdParty } from 'path/to/sdkjs'
const thirdParty = new ThirdParty({
    /* TODO: 预发环境, 发布线上替换成 util-server.lingxigames.com */
    host: 'pre-util-server.lingxigames.com',
})

export { thirdParty }
```

2. step2 在视图层注册登录相关事件

```ts
// unlogin.tsx
import { thirdParty } from 'path/to/lib.ts'

function Login() {
    const isLogined = thirdParty.isLogined('lingxi')
    const handleLogin = () => {
        // 拉起 lingxi 三方登录
        thirdParty.lingxiLogin({
            client_id: 'your gameId',
            os: 'your os platform', // 'ios' | 'android'
        })
    }
    return (
        <div>
            { !isLogined ? <button onClick={handleLogin}>登录</button> : '已登录'}
        </div>
    )
}
```

3. step3 获取三方 accessToken

```ts
// request.ts
// 网络请求处理模块
import { thirdParty } from 'path/to/lib'

try {
    const { accessToken } = await thirdParty.getAccessToken('lingxi')
} catch (e) {
    // 可以根据 e.code 做特殊业务处理
}

```

### 场景 2: 获取 lingxi fission_token

- step1 初始化配置

**初始化配置时**需要根据当前所属环境接入对应环境的域名

```ts
// lib.ts
import { ThirdParty } from 'path/to/sdkjs'
const thirdParty = new ThirdParty({
    /* TODO: 预发环境, 发布线上替换成 util-server.lingxigames.com */
    host: 'pre-util-server.lingxigames.com',
    /* TODO: 日常环境，发布线上替要替换成上述表格中对应的地址 */
    fissionURL: 'http://sapi19.game.alibaba.net/api/tplogin/login/thirdparty',
})

export { thirdParty }
```

- step2 在视图层注册登录相关事件

```tsx
// unlogin.tsx
import { thirdParty } from 'path/to/lib.ts'

function Login() {
    const isLogined = thirdParty.isLogined('lingxi', true)
    const handleLogin = () => {
        // 拉起 lingxi 三方登录
        thirdParty.lingxiLogin({
            client_id: 'your gameId',
            os: 'your os platform', // 'ios' | 'android'
        })
    }
    return (
        <div>
            { !isLogined ? <button onClick={handleLogin}>登录</button> : '已登录'}
        </div>
    )
}
```

- step3 获取 fission token

```ts
// request.ts
// 网络请求处理模块
import { thirdParty } from 'path/to/lib'

try {
    const { token } = await thirdParty.getFissionToken('lingxi')
} catch (e) {
    // 可以根据 e.code 做特殊业务处理
}

```
