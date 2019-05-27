"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const child_process_1 = require("child_process");
const process = require("process");
const packageJsonPath = path.resolve('package.json');
if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`${packageJsonPath} not exists.`);
}
let packageJson = require(packageJsonPath);
let cp = child_process_1.spawn('node', [path.join(__dirname, '../cluster.js'), `--title=[vemo]${packageJson.name}`], {
    detached: true,
});
cp.on('message', (data) => {
    console.log(data);
});
cp.stdout.on('data', (data) => {
    console.log(`[vemo] stdout: ${data}`);
});
cp.stderr.on('data', (data) => {
    console.log(`[vemo] stderr: ${data}`);
});
// console.log(`[vemo] process id: ${cp.pid}`)
setTimeout(() => {
    process.exit(0);
}, 1000);
