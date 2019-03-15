const path = require('path')
const fs = require('fs')

const Koa = require('koa')
const Router = require('koa-joi-router');
const co = require('co')
const render = require('koa-swig')
const app = new Koa()

// asign koa instance to koaInstance
global.koaInstance = app;

// config path
const configPath = path.resolve('vemofile.js')

if (!fs.existsSync(configPath)) {
    throw new Error('vemofile not exist!')
}

// default config
const defaultConfig = {
    "host": "localhost",
    "port": 5000,
    "root": path.resolve(),
    "template": {
        root: path.resolve('./template'),
        autoescape: true,
        cache: false,
        ext: 'html',
    },
    "map": {}
}
// user defined config
const userConfig = require(configPath)
const config = {...defaultConfig, ...userConfig}

if (!fs.existsSync(config.root)) {
    throw new Error(`${config.root} not exist!`)
}

// define routers
const routeMaps = Object.keys(config.map)
const defaultRouteConfig = {
    method: 'get',
    middlewares: [],
}
routeMaps.forEach((file) => {
    let filePath = path.resolve(config.root, file)
    let functions = require(filePath)
    let c = config.map[file] || {}
    c = {...defaultRouteConfig, ...c}
    c.route = c.route || `/${file}`

    let router = new Router()

    if (c.hasOwnProperty('validate')) {
        c.middlewares.push({
            validate: c.validate
        })
    }

    // call user define function
    router[c.method.toLowerCase() || 'get'](c.route, ...c.middlewares, async(ctx, next) => {
        ctx.body = await functions(ctx.request.body || {} ,ctx)
        await next()
    })
    
    app.use(router.middleware())
})

// render template
app.context.render = co.wrap(render({
    ...defaultConfig.template,
    ...config.template
}))

// start the server
app.listen(config.port, function(err) {
    if (err) {
        console.error(err);
    }
    else {
        console.info(`Listening on port %s. Open up http://${config.host}:%s/ in your browser.`, config.port, config.port);
    }
})