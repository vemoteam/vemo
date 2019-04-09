const path = require('path');
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
    'root': path.resolve('./server'),
    'template': {
        'map': {
            'html': 'underscore'
        },
        'options': {
            'cache': isProduction ? true : false // 生产环境的时候缓存模板
        }
    },
    'routes': [
        {
            path: 'index.js',
            route: '/',
            method: 'post',
            validate: {
                type: 'form',
                continueOnError: true
            }
        },
        {
            path: 'detail.js',
            template: 'template/detail.html',
            route: '/detail/:id',
            method: 'get',
            middlewares: [] 
        },
        {
            path: 'detail.js',
            template: './template/detail.html',
            route: '/detail',
            method: 'get',
            middlewares: [] 
        }
    ]
}