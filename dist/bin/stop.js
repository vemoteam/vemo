"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const { findByName, } = require('./list');
function stop(name) {
    let ps = findByName(name);
    if (ps) {
        child_process_1.execSync(`kill ${ps.id}`);
    }
    else {
        console.log(`[vemo] process name [${name}] does not exist.`);
    }
}
exports.stop = stop;
