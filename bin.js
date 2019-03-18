#!/usr/bin/env node

const path = require('path')
const nodeDev = require('node-dev')

nodeDev(
    path.join(__dirname, 'index.js'),
    [],
    [], 
    {
        _: [],
        'all-deps': false,
        deps: true,
        dedupe: false,
        poll: false,
        respawn: false,
        notify: true
    }
)