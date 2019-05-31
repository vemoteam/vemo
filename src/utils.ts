import * as os from 'os'
import * as path from 'path'

const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i
const stackReg2 = /at\s+()(.*):(\d*):(\d*)/i

interface LogInfo {
    time: string,
    method: string,
    path: string,
    line: string,
    pos: string,
    file: string,
    level: string,
    message: string,
    stack?: string
}

interface PowerDate extends Date {
    now?: string,
    format?: () => string
}

function padZero(num: number): string {
    if (num < 10) {
        return '0' + num
    } else {
        return num + ''
    }
}

function getPowerDate(): PowerDate {
    const date: PowerDate = new Date()

    date.now = date.getTime() + ''

    date.format = () => {
        const year = padZero(date.getFullYear()),
            month = padZero(date.getMonth() + 1),
            day = padZero(date.getDate()),
            hour = padZero(date.getHours()),
            minute = padZero(date.getMinutes()),
            second = padZero(date.getSeconds())
    
        return `${year}/${month}/${day} ${hour}:${minute}:${second}`
    }
    
    return date
}

class Logger {


    public constructor () {
        
    }

    private _capture (message: string, level: string): void | LogInfo {
        const error = new Error()
        const stackList = error.stack.split('\n').slice(3)
        const sp = stackReg.exec(stackList[0]) || stackReg2.exec(stackList[0])
        if (sp && sp.length === 5) {
            return {
                time: getPowerDate().format(),
                method: sp[1],
                path: sp[2],
                line: sp[3],
                pos: sp[4],
                file: path.basename(sp[2]),
                stack: error.stack,
                message,
                level
            }
        }
    }

    private _console (info: void | LogInfo) {
        if (!info) {
            return
        }

        const str = `[${info.level}] ${info.time} ${info.file}:${info.line} (${info.method}) ${info.message}`
        console.log(str)
    }

    public log (message: string) {
        const loginfo = this._capture(message, 'log')
        this._console(loginfo)
    }

    public info (message) {
        const loginfo = this._capture(message, 'info')
        this._console(loginfo)
    }

    public warn (message) {
        const loginfo = this._capture(message, 'warn')
        this._console(loginfo)
    }

    public error (message) {
        const loginfo = this._capture(message, 'error')
        this._console(loginfo)
    }
}

export = {
    get cpuNum():number {
        let len = os.cpus().length
        return Math.max(len, 4)
    },
    logger: new Logger()
}