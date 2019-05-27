import * as fs from 'fs'
import * as path from 'path'
import {
    spawn
} from 'child_process'
import * as process from 'process'

const packageJsonPath = path.resolve('package.json')

if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`${packageJsonPath} not exists.`)
}

let packageJson = require(packageJsonPath)

let cp = spawn('node', [path.join(__dirname, '../cluster.js'), `--title=[vemo]${packageJson.name}`], {
    detached : true,
})

cp.on('message', (data) => {
    console.log(data)
})

cp.stdout.on('data', (data) => {
    console.log(`[vemo] stdout: ${data}`)
})

cp.stderr.on('data', (data) => {
    console.log(`[vemo] stderr: ${data}`)
})

// console.log(`[vemo] process id: ${cp.pid}`)

setTimeout(() => {
    process.exit(0)
}, 1000);