const path = require('path')

module.exports = {
    'root': path.resolve('./server'),
    'socket': true, // 如果值为对象，则是 socket.io 的配置参数
    'routes': [
        {
            path: 'static',
            type: 'static'
        },
        {
            path: 'chat.js',
            template: './template/chat.html',
            route: '/',
            method: 'get'
        },
        {
            path: 'chat.js',
            template: './template/chat.html',
            route: '/chat',
            method: 'get'
        },
        {
            path: 'ws.js',
            type: 'websocket',
            route: '/ws'
        }
    ]
}