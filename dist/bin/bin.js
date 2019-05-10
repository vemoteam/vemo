#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const program = require('commander');
const packgeJson = require('../../package.json');
// show version
program
    .version(packgeJson.version);
program
    .description('get main script file')
    .command('main')
    .description('get main script from package.json')
    .action(function () {
    console.log(path.join(__dirname, '../', packgeJson.main));
});
program
    .command('init [dirname]')
    .description('init project base on template')
    .action(function (dirname = './') {
    let init = require('./init');
    init.init(dirname);
});
program
    .command('dev')
    .description('start server in development env')
    .action(function () {
    process.env.NODE_ENV = 'development';
    require('./dev');
});
program
    .command('start')
    .description('start server in production env')
    .action(function () {
    process.env.NODE_ENV = 'production';
    require('./start');
    let list = require('./list');
    setTimeout(() => {
        list.showPs();
    }, 900);
});
program
    .command('restart <process_name>')
    .description('restart server in production env')
    .action(function (process_name) {
    let stop = require('./stop');
    stop.stop(process_name);
    process.env.NODE_ENV = 'production';
    require('./start');
    let list = require('./list');
    setTimeout(() => {
        list.showPs();
    }, 900);
});
program
    .command('list')
    .description('list all process in production env')
    .action(function () {
    let list = require('./list');
    list.showPs();
});
program
    .command('stop <process_name>')
    .alias('delete')
    .description('stop server in production env')
    .action(function (process_name) {
    let list = require('./list');
    let stop = require('./stop');
    stop.stop(process_name);
    list.showPs();
});
program.parse(process.argv);
// // vemo 命令
// if (program.args.length < 1 ) {
//     require('./start')
// }
// ps aux | grep -i -w "node /Users/heyli/Repo/tcb/vemo/dist/cluster.js" | grep -v grep | awk '{print $2}'
// ps aux | grep -i '\-\-title=\[vemo\]' | grep -v grep | awk '{print $11 " " $2 " " $12 " " $13}' | grep ^node
