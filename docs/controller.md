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

`io`: [socket.io server 对象](https://socket.io/docs/server-api/#Server)

```js

module.exports = (io) => {
    io
    .on('connection', function (socket) {
        socket.emit('client', { hello: 'client' });
        socket.on('server', function (data) {
            console.log(data);
        })
    })
};
```