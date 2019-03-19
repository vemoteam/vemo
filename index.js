const path = require('path')
const fs = require('fs')

const Koa = require('koa')
const Router = require('koa-joi-router');
const co = require('co')
const views = require('@vemo/koa-views')
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
        autoRender: false
    },
    "map": {}
}
// user defined config
const userConfig = require(configPath)
const config = {...defaultConfig, ...userConfig}

if (!fs.existsSync(config.root)) {
    throw new Error(`${config.root} not exist!`)
}

// render template
if (!config.TplOff) {
    let tplConfig = {
        ...defaultConfig.template,
        ...config.template
    }
    let tplRoot = tplConfig.root
    delete tplConfig['root']
    app.use(views(tplRoot, tplConfig))
}

// define routers
const defaultRouteConfig = {
    method: 'get',
    middlewares: [],
    route: '/'
}
config.routes.forEach((route) => {
    let filePath = path.resolve(config.root, route.path)
    let functions = require(filePath)
    let c = route || {}
    c = {...defaultRouteConfig, ...c}

    let router = new Router()

    if (c.hasOwnProperty('validate')) {
        c.middlewares.push({
            validate: c.validate
        })
    }

    // call user define function
    router[c.method.toLowerCase() || 'get'](c.route, ...c.middlewares, async(ctx, next) => {
        ctx.body = await functions(ctx.request.body || {}, ctx)
        await next()
    })
    
    app.use(router.middleware())
})

// start the server
app.listen(config.port, function(err) {
    if (err) {
        console.error(err);
    }
    else {
        console.info(`Listening on port %s. Open up http://${config.host}:%s/ in your browser.`, config.port, config.port);
    }
})