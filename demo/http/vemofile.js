const path = require('path');

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
            route: "/",
            method: "post",
            validate: {
                type: 'form',
                continueOnError: true
            }
        },
        {
            path: 'detail.js',
            template: path.resolve('server/template/detail.html'),
            route: "/detail/:id",
            method: "get",
            middlewares: [] 
        },
        {
            path: 'detail.js',
            template: './template/detail.html',
            route: "/detail",
            method: "get",
            middlewares: [] 
        }
    ]
}