# QQ 分享

## 注意事项

:::warning 注意
如果只在端外分享，platform 设置为 'web'。如果只在端内分享，platform 设置为 'native'。默认不设置，会自动根据宿主环境决定是端内还是端外分享。
:::

```ts
import { SocialShare } from '@ali-ieu/ieu-js-sdk'

const share = new SocialShare({
    platform: '', //'native' 只在端内 , 'web' 只在端外 .
})
```

## 网页分享

QQ 网页分享一般是分享到 QQ 空间

-   分享到 Qzone

```ts
share.QQ({
    type: 'qzone',
    link: 'https://github.com',
    message: '这是描述',
    title: '这是title',
    medias: ['https://example.png'],
})
```

## 端内分享

QQ 端内分享支持 `图片`，`链接`

### qzone 分享

-   分享链接，携带描述，title

```ts
share.QQ({
    type: 'qzone',
    link: 'https://github.com',
    message: '这是描述',
    title: '这是title',
})
```

-   分享单张图片

```ts
share.QQ({
    type: 'qzone',
    medias: ['https://example.png'],
})
```

-   分享纯文字

```ts
share.QQ({
    type: 'qzone',
    message: '纯文字信息',
})
```

#### 好友分享

和上面类似，只需要修改 `type` 类型即可。

-   分享链接，携带描述，title

```ts
share.QQ({
    type: 'messenger',
    link: 'https://github.com',
    message: '这是描述',
    title: '这是title',
})
```

-   分享单张图片

```ts
share.QQ({
    type: 'messenger',
    medias: ['https://example.png'],
})
```

-   分享纯文字

```ts
share.QQ({
    type: 'messenger',
    message: '纯文字信息',
})
```
