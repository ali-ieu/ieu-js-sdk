## How To Use
页面初始化时使用。
```javascript
import { BigEye, BrowserLogger  } from '@alife/publicity-m-monitor';

MMoni({
  targetId: "app", // 监听对象的id，一般为根节点的id
  envFlag: process.env.NODE_ENV, // 开发环境默认为'development'，其余都认为是线上监控环境
  // ARMS的必配参数
  loggerConfig: {
    pid: "your app pid of arms",
    release: "1.0.0",
    name: "test",
  },
});
```
## Features
### 大图检测
移动端短边超过 750（750x1334）的图片都被认为危险。**线上**：监控上报到 ARMS；**本地开发**：图片进行颠倒或高亮处理，提醒开发同学更改。

支持配置绝对信任标志，请谨慎使用，在节点处添加属性`mmtrust="true"`。
```html
<!-- img标签 -->
<img
      @click="show2Pic = true"
      height="300px"
      src="@/public/imgs/person4.png"
      mmtrust="true"
    	/>

<!-- background背景图 -->
<div v-if="show2Pic" class="img-test" mmtrust="true"></div>
```

### 内嵌ARMS

```javascript
import { BigEye, BrowserLogger  } from '@alife/publicity-m-monitor';

BrowserLogger.api(api, success, time, code, msg, begin, traceId, sid)
```

更多使用请参考ARMS官方文档https://help.aliyun.com/document_detail/58657.html 。

## License
ISC license
