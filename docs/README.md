# IEU SDK

IEU SDK, 目前包括三方登录，ejoysdk, 端内分享等功能。

## 接入须知

对接三方登录时，**优先确认接入的登录类型**，然后仔细阅读文档！！！

对接端内分享时，**优先确认是否只接入端内**，然后仔细阅读文档！！！

## 安装

**暂无 npm 包下载**

## 三方登录

在开始前，请先做如下的事情。

1. 本次活动(应用)需要接入的**登录渠道**。
2. 本次活动(应用)是否需要接入 **fission_token。**(目前大部分的活动都是接这个)

目前支持的接入的渠道

- [x] [lingxi](/lingxi)
- [x] [airline](/airline)
- [x] [weixin](/weixin)
- [ ] qq 待接入验证
- [ ] weibo 待接入验证

## Caveats

**SDK 在三方登录完，重定向到应用首页时会删除 url 上内置的保留字段.**

这些字段目前包括 `client_id`, `access_code`, `third_party_channel`, `airline_type`, `os`.

**如果应用的 `location.search` 上 有使用到如上的字段，为保证应用正常运行，请更换为别的字段命名.**


## License

Released under [MIT License](./LICENSE).
