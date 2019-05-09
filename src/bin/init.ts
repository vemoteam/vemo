import * as path from 'path'
import * as fs from 'fs-extra'
import { string } from 'joi';
const inquirer = require('inquirer')

interface Answers {
    tpl: string
    project: string
}

async function ask(): Promise<Answers> {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt([
                {
                    name: 'project',
                    type: 'input',
                    message: 'Please input project name',
                },
                {
                    name: 'tpl',
                    type: 'list',
                    message: 'Please select template type',
                    default: 'http',
                    choices: ['http', 'websocket']
                }
            ])
            .then((answers: Answers) => {
                resolve(answers)
            })
            .catch(err => {
                reject(err)
            })
    })
}

module.exports = {
    async init(dirname) {
        let dir = path.resolve(dirname)

        let answers = await ask()
        let tplPath = path.join(__dirname, '../demo', answers.tpl)

        try {
            fs.copySync(tplPath, dir)

            if (answers.project) {
                let pkgJsonPath = path.join(tplPath, 'package.json')
                let pkgJson = require(pkgJsonPath)
                pkgJson.name = answers.project
                fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkgJson, null, 2), 'utf-8')
            }
        }
        catch (e) {
            console.error(e.message)
        }
    }
}