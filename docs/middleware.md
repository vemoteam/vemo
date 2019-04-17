# 中间件

在 `route` 配置下，有 `middlewares` 项可以配置中间件。但不同的 `route` 模式写法并不一样。

## http

如果 `route.type` 是 `http`，则中间件是 [`koa`](https://koajs.com/#application) 的中间件。写法如下，并且一般对象都会绑定在 `ctx` 下面。

```js
module.exports = async (ctx, next) => {
    // 逻辑
    ctx.user = {
        nickName: 'abc'
    }
    await next() // 往下一个中间件走
}
```

## websocket

如果 `route.type` 是 `websocket`，则中间件是 [`socket.io`](https://socket.io/docs/server-api/#namespace-use-fn) 的中间件。写法如下，并且一般要注入对象都会绑定在 `socket` 下面

```js
module.exports = (socket, next) => {
    // 逻辑
    socket.user = {
        nickName: 'abc'
    }
    next() // 往下一个中间件走
}
```