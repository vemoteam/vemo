const path = require('path');
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
    'root': path.resolve('./server'),
    'static': true,
    'template': {
        'map': {
            'html': 'underscore'
        }
        'options': {
            'cache': isProduction ? true : false // 生产环境的时候缓存模板
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