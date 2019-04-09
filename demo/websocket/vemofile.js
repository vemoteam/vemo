const path = require('path');

module.exports = {
    'root': path.resolve('./server'),
    'static': true,
    'template': {
        'map': {
            'html': 'underscore'
        }
    },
    'socket': true, // 如果值为对象，则是 socket.io 的配置参数
    'routes': [
        {
            path: 'chat.js',
            template: './template/chat.html',
            route: '/',
            method: 'get',
            middlewares: [] 
        },
        {
            path: 'chat.js',
            template: './template/chat.html',
            route: '/chat',
            method: 'get',
            middlewares: [] 
        },
        {
            path: 'ws.js',
            type: 'websocket',
            route: '/ws'
        },
    ]
}