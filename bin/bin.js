#!/usr/bin/env node
const program = require('commander')
const packgeJson = require('../package.json')

// show version
program
    .version(packgeJson.version)

program
    .command('dev')
    .action(function () {
        process.env.NODE_ENV = 'development'
        require('./dev')
    })

program
    .command('start')
    .action(function () {
        process.env.NODE_ENV === 'production'
        require('./start')
        let list = require('./list')
        setTimeout(() => {
            list.showPs()
        }, 900)
    })

program
    .command('restart <ps_name>')
    .action(function (ps_name) {
        let stop = require('./stop')
        stop.stop(ps_name)

        process.env.NODE_ENV === 'production'
        require('./start')

        let list = require('./list')
        setTimeout(() => {
            list.showPs()
        }, 900);
        
    })

program
    .command('list')
    .action(function () {
        let list = require('./list')
        list.showPs()
    })

program
    .command('stop <ps_name>')
    .action(function (ps_name) {
        let list = require('./list')
        let stop = require('./stop')
        stop.stop(ps_name)
        list.showPs()
    })

program.parse(process.argv)

// ps aux | grep -i -w "node /Users/heyli/Repo/tcb/vemo/src/cluster.js" | grep -v grep | awk '{print $2}'
// ps aux | grep -i '\-\-title=\[vemo\]' | grep -v grep | awk '{print $11 " " $2 " " $12 " " $13}' | grep ^node