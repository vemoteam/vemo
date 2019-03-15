#!/usr/bin/env node

const path = require('path')
const spawn = require('cross-spawn')

const result = spawn.sync(path.join(__dirname, './node_modules/.bin/node-dev'), [path.join(__dirname, 'index.js')], { stdio: 'inherit' });