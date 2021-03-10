# Twitter 分享

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

twitter 网页分享只有 `link` 属性有效，分享内容由**开放图谱**决定。

```ts
share.Twitter({
    link: 'https://github.com',
})
```

## 端内分享

::: danger 注意
暂不支持 twitter 端内分享
:::
