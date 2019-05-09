import * as path from 'path'
import * as fs from 'fs'

import {
    VemoError,
    VemoFileNotExist,
    ConfigRootNotExist,
} from './error'

const cloudBaseMiddleware = require('./cloudbase')

import * as Koa from 'koa'
import * as Router from 'koa-joi-router'
import * as serve from 'koa-static'
import { ServerResponse } from 'http';

let app = new Koa()
const views = require('@vemo/koa-views')
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
let defaultConfig: {
    host: string
    port: number | string
    root: string
    cloudbase: boolean | object
    template?: any
} = {
    host: 'localhost',
    port: 5000,
    root: path.resolve(),
    cloudbase: false, // 默认开启
    template: {
        map: {
            html: 'underscore'
        },
        options: {
            cache: isProduction ? true : false // 生产环境的时候缓存模板
        }
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

function initTemplate(): void {
    // render template
    if (config.template) {
        let tplConfig = {
            ...defaultConfig.template,
            ...config.template
        }
        app.use(views(config.root, tplConfig))
    }
}

function initIO(): null | any {
    // init socket.io
    let io: SocketIO.Server
    if (config.socket) {
        let socketConfig = (typeof config.socket === 'object') ? config.socket : {}
        io = require('socket.io')(server, socketConfig)
        return io
    }

    return null
}

function initCloudBase(instance): void {
    if (config.cloudbase) {
        config.cloudbase = typeof config.cloudbase === 'object' ?  config.cloudbase : {
            env: null
        }
    
        instance.use(cloudBaseMiddleware(config.cloudbase))
    }
}

let io = initIO()
initTemplate()
initCloudBase(app)

// define routers
const defaultRouteConfig = {
    method: 'get',
    // middlewares: [],
    route: '/',
    type: 'http',
}
config.routes.forEach((route) => {
    let filePath = path.isAbsolute(route.path) ? route.path : path.resolve(config.root, route.path)
    let handler = route.type !== 'static' ? require(filePath) : null
    let c = route || {}
    c = {...defaultRouteConfig, ...c}
    c.middlewares = c.middlewares || []

    // for http route
    if (c.type === 'http') {
        let router = Router()

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

        initCloudBase(r)

        // pass io object to handler
        // handler(r)

        r.on('connect', async (socket) => {
            let appCtx = app.createContext(socket.request, <ServerResponse>{})
            let context = {
                app,
                io,
                socket,
                tcb: socket.hasOwnProperty('tcb') ? socket.tcb : null,
                request: appCtx.request,
                response: appCtx.response
            }

            handler(socket, context)
        })
    }
    else if (c.type === 'static') {
        let root = path.isAbsolute(c.path) ? c.path : path.join(config.root, c.path)

        app.use(serve(root, c.options || {}))
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