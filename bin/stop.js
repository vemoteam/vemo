const execSync = require('child_process').execSync
const {
    findByName,
} = require('./list')

function stop(name) {
    let ps = findByName(name)
    execSync(`kill ${ps.id}`)
}

exports.stop = stop

