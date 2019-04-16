# 请求处理

## http 请求

如下面例子，无论有没有模板渲染，直接返回数据即可。

`ctx`: koa ctx
`event`: ctx.request.body

```js

module.exports = async (event, ctx) => {
    return {
        name: 'baby'
    }
};
```

## websocket 请求

如下面例子，利用传入的 `io` 对象处理各种 `websocket` 的事件。

`socket`: [socket.io socket 对象](https://socket.io/docs/server-api/#Socket)
`ctx`: 运行上下文
- `ctx.request`: `socket.request`
- `ctx.io`: [socket.io io 对象](https://socket.io/docs/server-api/#Server)

```js

module.exports = (socket, ctx) => {
    socket.emit('client', { hello: 'client' });
    socket.on('server', function (data) {
        console.log(data);
    })
};
```