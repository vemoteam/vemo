const path = require('path');

module.exports = {
    "root": path.resolve("./server"),
    "template": {
        "map": {
            "html": "underscore"
        }
    },
    "socket": true,
    "routes": [
        {
            path: 'chat.js',
            template: './template/chat.html',
            route: "/",
            method: "get",
            middlewares: [] 
        },
        {
            path: 'chat.js',
            template: './template/chat.html',
            route: "/chat",
            method: "get",
            middlewares: [] 
        },
        {
            path: 'ws.js',
            type: 'websocket',
            route: "/ws"
        },
    ]
}