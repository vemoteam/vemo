const execSync = require('child_process').execSync
const {
    findByName,
} = require('./list')

function stop(name) {
    let ps = findByName(name)
    if (ps) {
        execSync(`kill ${ps.id}`)
    }
    else {
        console.log(`[vemo] process name [${name}] does not exist.`)
    }
}

exports.stop = stop

