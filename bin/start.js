const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn
const process = require('process')

const packageJsonPath = path.resolve('package.json')

if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`${packageJsonPath} not exists.`)
}

let packageJson = require(packageJsonPath)

let cp = spawn('node', [path.join(__dirname, '../src/cluster.js'), `--title=[vemo]${packageJson.name}`], {
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