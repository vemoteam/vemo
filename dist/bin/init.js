"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs-extra");
const inquirer = require('inquirer');
async function ask() {
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
            .then((answers) => {
            resolve(answers);
        })
            .catch(err => {
            reject(err);
        });
    });
}
module.exports = {
    async init(dirname) {
        let dir = path.resolve(dirname);
        let answers = await ask();
        let tplPath = path.join(__dirname, '../../demo', answers.tpl);
        try {
            fs.copySync(tplPath, dir);
            if (answers.project) {
                let pkgJsonPath = path.join(tplPath, 'package.json');
                let pkgJson = require(pkgJsonPath);
                pkgJson.name = answers.project;
                fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkgJson, null, 2), 'utf-8');
            }
        }
        catch (e) {
            console.error(e.message);
        }
    }
};
