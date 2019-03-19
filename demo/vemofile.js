const path = require('path');

module.exports = {
    "root": path.resolve("./server"),
    "template": {
        "root": path.resolve("./server/template"),
        "map": {
            "html": "underscore",
            "extension": "html"
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
            route: "/detail/:id",
            method: "get",
            middlewares: [] 
        }
    ]
}