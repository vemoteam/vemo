const path = require('path')
const fs = require('fs')

const {
    VemoError,
    VemoFileNotExist,
    ConfigRootNotExist,
} = require('./error')

const Koa = require('koa')
const Router = require('koa-joi-router')
const serve = require('koa-static')
const views = require('@vemo/koa-views')
const app = new Koa()
const server = require('http').Server(app.callback())

const isProduction = process.env.NODE_ENV === 'production'

// asign koa instance to koaInstance
global.koaInstance = app

// asign server instance to serverInstance
global.serverInstance = server

// config path
const configPath = path.resolve('vemofile.js')

if (!fs.existsSync(configPath)) {
    throw new VemoError(VemoFileNotExist, 'vemofile not exist!')
}

// default config
let defaultConfig = {
    'host': 'localhost',
    'port': 5000,
    'root': path.resolve(),
}
defaultConfig.template = {
    'map': {
        'html': 'underscore'
    },
    'options': {
        'cache': isProduction ? true : false // 生产环境的时候缓存模板
    }
}
// user defined config
const userConfig = require(configPath)
const config = {...defaultConfig, ...userConfig}

// retify some config stuff
config.template.autoRender = false

if (!fs.existsSync(config.root)) {
    throw new VemoError(ConfigRootNotExist, `${config.root} not exist!`)
}

// init static files serving
if (config.static) {
    let staticConfig = (typeof config.static === 'object') ? config.static : {
        'root': 'static',
        'options': {}
    }

    if (!path.isAbsolute(staticConfig.root)) {
        staticConfig.root = path.join(config.root, staticConfig.root)
    }
    app.use(serve(staticConfig.root, staticConfig.options))
}

// init socket.io
let io = null
if (config.socket) {
    let socketConfig = (typeof config.socket === 'object') ? config.socket : {}
    io = require('socket.io')(server, socketConfig)
}

// render template
if (!config.templateOff) {
    let tplConfig = {
        ...defaultConfig.template,
        ...config.template
    }
    app.use(views(config.root, tplConfig))
}

// define routers
const defaultRouteConfig = {
    method: 'get',
    // middlewares: [],
    route: '/',
    type: 'http',
}
config.routes.forEach((route) => {
    let filePath = path.isAbsolute(route.path) ? route.path : path.resolve(config.root, route.path)
    let handler = require(filePath)
    let c = route || {}
    c = {...defaultRouteConfig, ...c}
    c.middlewares = c.middlewares || []

    // for http route
    if (c.type === 'http') {
        let router = new Router()

        if (c.hasOwnProperty('validate')) {
            c.middlewares.push({
                validate: c.validate
            })
        }

        // call user define function
        router[c.method.toLowerCase() || 'get'](c.route, ...c.middlewares, async(ctx, next) => {
            let data = await handler(ctx.request.body || {}, ctx) || {}
            if (c.template) {
                ctx.body = await ctx.render(c.template, data)
            }
            else {
                ctx.body = data
            }
            
            await next()
        })
        
        app.use(router.middleware())
    }
    // for websocket route
    else if (c.type === 'websocket' && config.socket) {
        // socket.io namespace
        let r = io.of(c.route)
        
        // namespace middleware
        c.middlewares.forEach((fn) => {
            r = r.use(fn)
        })

        // pass io object to handler
        handler(r)
    }
})

// start the server
server.listen(config.port, function(err) {
    if (err) {
        console.error(err);
    }
    // 生产环境不输出
    else if (!isProduction) {
        console.log(`Listening on port %s. Open up http://${config.host}:%s/ in your browser.`, config.port, config.port);
    }
})