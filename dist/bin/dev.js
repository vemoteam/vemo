"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const minimist = require('minimist');
const nodeDev = require('node-dev');
// copy from node-dev bin file
function getFirstNonOptionArgIndex(args) {
    for (let i = 2; i < args.length; i++) {
        if (args[i][0] != '-')
            return i;
    }
    return args.length;
}
function removeValueArgs(args, names) {
    let i = 0;
    let removed = [];
    while (i < args.length) {
        if (~names.indexOf(args[i])) {
            removed = removed.concat(args.splice(i, 2));
        }
        else {
            i++;
        }
    }
    return removed;
}
let nodeArgs = removeValueArgs(process.argv, ['-r', '--require']);
let scriptIndex = getFirstNonOptionArgIndex(process.argv);
let scriptArgs = process.argv.slice(scriptIndex + 1);
let devArgs = process.argv.slice(2, scriptIndex);
let opts = minimist(devArgs, {
    boolean: ['all-deps', 'deps', 'dedupe', 'poll', 'respawn', 'notify'],
    default: { deps: true, notify: true },
    unknown: function (arg) {
        nodeArgs.push(arg);
    }
});
nodeDev(path.join(__dirname, '../dist/index.js'), scriptArgs, nodeArgs, opts);
