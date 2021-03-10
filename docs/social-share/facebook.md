# Facebook 分享

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

facebook 网页分享只有 `link` 属性有效，分享内容由**开放图谱**决定。

```ts
share.FaceBook({
    link: 'https://github.com',
})
```

## 端内分享

facebook 端内分享支持 `图片`，`链接`(内容由开放图谱决定)，或者`视频`。

#### timeline 分享

-   分享链接

```ts
share.FaceBook({
    type: 'timeline',
    link: 'https://github.com',
})
```

-   分享图片

```ts
share.FaceBook({
    type: 'timeline',
    meidas: ['https://example.png'],
})
```

#### 好友分享

-   分享链接

```ts
share.FaceBook({
    type: 'messenger',
    link: 'https://github.com',
})
```

-   分享图片

```ts
share.FaceBook({
    type: 'messenger',
    meidas: ['https://example.png'],
})
```
