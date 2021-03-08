## facebook

### demo

```ts
import { SocialShare } from '@ali-ieu/ieu-js-sdk'

const share = new SocialShare({
    platform: 'web',
})

share.FaceBook({
    title: 'title',
    message: 'message',
    link: 'https://github.com',
    medias: ['https://abc.png'],
})
```
