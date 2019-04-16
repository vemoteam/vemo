# 配置

`vemo` 的陪着是指在项目根目录下的 `vemofile.js` 配置文件。该文件导出一个配置对象。

## host

服务域名，默认值为 `localhost`

## port

服务端口，默认值为 `5000`

## root

服务文件、模板文件的根目录，默认值是当前目录

### 示例

```js
const path = require('path');
module.exports = {
    'root': path.resolve('./server'),
    'routes': [
        {
            path: 'index.js',
            route: '/',
            method: 'get'
        },
    ]
}
```

由于`root` 有定义，因此 `routes` 中的 `index.js` 路径是： `path.join(path.resolve('./server'), 'index.js')` 。

## static

静态资源处理，值可以是 `boolean` 或 `object`。如果值为 `true`，是默认值是：

```js
'static': {
    'root': 'static',
    'options': {}
}
```

### 示列

```js
const path = require('path');
module.exports = {
    'root': path.resolve('./server'),
    'static': {
        'root': path.resolve('./server/static/'), // 既可以是绝对路径，也可以是相对路径（相对于root）
        'options': {}
    }，
    'routes': [
        {
            path: 'index.js',
            route: '/',
            method: 'get'
        },
    ]
}
```

## template

模板的配置，值可以是 `boolean` 或 `object`，如果是 `true` 的时候，默认值请参考下面的 `标例`。 此处使用的开源项目是 [`@vemo/koa-views`](https://github.com/lcxfs1991/koa-views) ，基于 `koa-views` 的定制版本。

### 示例

```js
const isProduction = process.env.NODE_ENV === 'production'
// vemo 的模板默认配置
module.exports = {
    'template': {
        'map': {
            'html': 'underscore' // html 文件的引擎默认采用 underscore
        },
        'options': {
            'cache': isProduction ? true : false // 生产环境的时候缓存模板，填其它 options 时，请不要忘记重新将些配置带上
        }
    }
}
```

上面的配置表示，`html` 后缀的模板文件，使用 `underscore` 模板引擎解析。

## socket

开启 websocket 功能。如果值为 `true`，使用默认 [`socket.io`](https://socket.io/docs/server-api/) 配置，如果值为对象，则可以自定义 [`socket.io`](https://socket.io/docs/server-api/) 的配置。

## cloudbase

腾讯云云开发内置中间件，注入 [tcb-admin-node](https://github.com/TencentCloudBase/tcb-admin-node/) 对象（挂在在 `ctx` 上下文中），并且会协助获取临时密钥。

|类型 | 必填 | 默认值 | 说明
| --- | --- | --- | ---
| boolean/object |  否 | false | 与腾讯云云开发相关的配置项，设置 `true` 或者填写 `object` 配置的时候则会开启。如果为 `true`，会在云主机中尝试获取临时密钥对

* 类型为 `object` 时的字段 

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| secretId | string | 否 | | 腾讯云 API 固定密钥对。[前往获取](https://console.cloud.tencent.com/cam/capi)
| secretKey | string | 否 | | 同上
| env | string | 否 | | 云开发环境 id
| maxRetryTimes | number | 否 | 生产环境最多重试3次，开发环境不重试 | 如果不填上面的固定密钥对，会尝试拉取临时密钥对（只在腾讯云的云主机，且该云账号有授权小程序云主机角色才生效）

### 示例

```js
const path = require('path');
module.exports = {
    'cloudbase': {
        secretId: 'xxx',
        secretKey: 'xxx',
        env: 'xxx',
        maxRetryTimes: 3
    },
    'root': path.resolve('./server'),
    'static': {
        'root': path.resolve('./server/static/'), // 既可以是绝对路径，也可以是相对路径（相对于root）
        'options': {}
    }，
    'routes': [
        {
            path: 'index.js',
            route: '/',
            method: 'get'
        },
    ]
}
```

## routes

配置服务路由和处理逻辑文件的对象。

### 示例

```js
// 示例
module.exports = {
    "root": path.resolve("./server"),
    "template": {
        "map": {
            "html": "underscore"
        }
    },
    "routes": [
        {
            path: 'index.js',
            template: './template/chat.html',
            route: "/",
            method: "get",
            middlewares: [] 
        }
    ]
};
```

### routes 对象参数

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| type | string | 否 | 'http' | 路由类型，值为 `http` 或  `websocket`
| path | string | 是 | | 文件路径
| route | string | 否 | '/' | 路由路径
| template | string | 否 | | 可使用绝对路径或相对路径(相对于 `root`)
| method | string | 否 | 'get' | `type` 为 `http` 的情况下，可以填 `get`, `post`, `put` 等 `http` 方法的值
| middlewares | array | 否 | [] | 中间件数组
| validate | object | 否 | | 使用了 [koa-joi-route](https://github.com/koajs/joi-router/)，参数值该类库的 `validate` 参数

至于 `path` 所指向的文件如何处理 `http` 和 `websocket` 请求，可参考文档 [请求处理](./controller.md)