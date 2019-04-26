const path = require('path')
const router = require('koa-joi-router')
const Joi = router.Joi

module.exports = {
    'host': 'localhost',
    'port': 5001,
    'root': path.resolve('.'),
    'socket': true,
    'routes': [
        {
            path: 'routes/api.js',
            route: '/api',
            method: 'post',
            validate: {
                type: 'json',
                continueOnError: false,
                body: {
                    param1: Joi.string(),
                    param2: Joi.number()
                }
            }
        },
        {
            path: 'routes/index.js',
            template: 'templates/index.html',
            route: '/home',
            method: 'get'
        },
        {
            type: 'static',
            path: 'public'
        },
        {
            path: 'routes/chat.js',
            template: 'templates/chat.html',
            route: '/chat',
            method: 'get'
        },
        {
            path: 'routes/ws.js',
            type: 'websocket',
            route: '/ws'
        }
    ]
}

