const path = require('path');

module.exports = {
    "root": path.resolve("./server"),
    "template": {
        "root": path.resolve("./server/template")
    },
    "map": {
        "index": {
            route: "/",
            method: "post",
            validate: {
                type: 'form',
                continueOnError: true
            }
        },
        "detail": {
            route: "/detail",
            method: "get",
            middlewares: [] 
        }
    }
}