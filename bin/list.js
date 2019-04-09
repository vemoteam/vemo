const execSync = require('child_process').execSync
const {
    table
} = require('table')
const chalk = require('chalk')

function findAll() {
    let cmd = 'ps aux | grep -i \'\\-\\-title=\\[vemo\\]\' | awk \'{print $11 " " $2 " " $12 " " $13 " " $9}\''
    let result = execSync(cmd, {
        encoding: 'utf-8'
    })
    
    result = result.split('\n')
    result = result.filter((item) => {
        return item && /^node/.test(item)
    })

    let psInfo = {}

    result.forEach((item) => {
        let ps = item.split(' ')
        let id = ps[1]
        psInfo[id] = {}
        psInfo[id].name = ps[3].replace('--title=[vemo]', '')
        psInfo[id].uptime = ps[4]
        return psInfo
    })

    return psInfo
}

function findById(id) {
    let psInfo = findAll()
    if (psInfo.hasOwnProperty(id)) {
        return psInfo[id]
    }

    return null
}

function findByName(name) {
    let psInfo = findAll()
    let ps = null
    Object.keys(psInfo).forEach((k) => {
        if (psInfo[k].name === name) {
            ps = {
                id: k,
                ...psInfo[k]
            }
        }
    })

    return ps
}

function showPs() {
    let psInfo = findAll()
    let data = [
        ['name', 'id', 'uptime']
    ]

    data[0] = data[0].map((item) => {
        return chalk.green(item)
    })

    Object.keys(psInfo).forEach((k) => {
        data.push([
            psInfo[k].name,
            k,
            psInfo[k].uptime
        ])
    })

    let output = table(data)
    console.log(output)
}

exports.findAll = findAll
exports.findById = findById
exports.findByName = findByName
exports.showPs = showPs