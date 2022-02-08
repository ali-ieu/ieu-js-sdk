# 微博分享

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
微博网页分享，支持 `链接`，`图片`，`纯文字`

-   分享链接，携带文本,单张图片

```ts
share.Sina({
    type: 'weibo',
    link: 'https://github.com',
    title: '纯文字信息',
    medias: ['https://example.png']
})
```

-   分享单张图片

```ts
share.Sina({
    type: 'weibo',
    medias: ['https://example.png'],
})
```

-   分享纯文字

```ts
share.Sina({
    type: 'weibo',
    title: '纯文字信息',
})
```

## 端内分享

微博端内分享同上

