# 微信分享

## 注意事项

:::warning 注意
如果只在端外分享，platform 设置为 'web'。如果只在端内分享，platform 设置为 'native'。默认不设置，会自动根据宿主环境决定是端内还是端外分享。
:::

```ts
import { SocialShare } from '@ali-ieu/ieu-js-sdk'

const share = new SocialShare({
    platform: '', //'native' 只在端内 , 'web' 只在端外 .
    wxConfig: {
        debug: false,
        appId: '',
        timestamp: '',
        nonceStr: '',
        signature: '',
        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'], // 自行拓展
    },
})
```

## 网页分享

微信的网页分享其实是通过微信的 JS-SDK 更新分享信息而已(并不主动拉起分享)，同时限制是只有在**微信内置浏览器**中。

## 端内分享

微信端内分享支持 `图片`，`链接`，`纯文字`

### timeline 分享

-   分享链接，携带描述，title

```ts
share.WeChat({
    type: 'timeline',
    link: 'https://github.com',
    message: '这是描述',
    title: '这是title',
})
```

-   分享单张图片

```ts
share.WeChat({
    type: 'timeline',
    meidas: ['https://example.png'],
})
```

-   分享纯文字

```ts
share.WeChat({
    type: 'timeline',
    message: '纯文字信息',
})
```

#### 好友分享

和上面类似，只需要修改 `type` 类型即可。

-   分享链接，携带描述，title

```ts
share.WeChat({
    type: 'messenger',
    link: 'https://github.com',
    message: '这是描述',
    title: '这是title',
})
```

-   分享单张图片

```ts
share.WeChat({
    type: 'messenger',
    meidas: ['https://example.png'],
})
```

-   分享纯文字

```ts
share.WeChat({
    type: 'messenger',
    message: '纯文字信息',
})
```
