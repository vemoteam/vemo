const path = require('path')

module.exports = {
    'root': path.resolve('./server'),
    'routes': [
        {
            path: 'api.js',
            route: '/api',
            method: 'post',
            validate: {
                type: 'form',
                continueOnError: true
            }
        },
        {
            path: 'index.js',
            template: './template/index.html',
            route: '/',
            method: 'get'
        }
    ]
}