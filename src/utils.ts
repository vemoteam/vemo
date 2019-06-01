import * as os from 'os'
import * as path from 'path'
import { default as chalk } from 'chalk'

// 堆栈报错格式: https://github.com/v8/v8/wiki/Stack%20Trace%20API
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
    now?: () => string,
    format?: () => string
}

/**
 * 自动为数字补0
 * @param num 
 */
function padZero(num: number): string {
    if (num < 10) {
        return '0' + num
    } else {
        return num + ''
    }
}

/**
 * 增强型Date对象
 */
function getPowerDate(): PowerDate {
    const date: PowerDate = new Date()

    date.now = () => date.getTime() + ''

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

/**
 * 日志类
 */
class Logger {

    /**
     * 颜色函数映射
     */
    private _colors: any;

    public constructor () {
        this._colors = {
            info: chalk.blue,
            success: chalk.green,
            warn: chalk.yellow,
            error: chalk.red
        }
    }

    /**
     * 捕获日志的时间、触发函数、触发文件等详细信息
     * 
     * @param message 日志信息
     * @param level 日志级别
     */
    private _capture (message: string, level: string): void | LogInfo {
        const error = new Error()
        const stackList = error.stack.split('\n').slice(3)
        const sp = stackReg.exec(stackList[0]) || stackReg2.exec(stackList[0])
        
        if (!sp) {
            return
        }

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

    /**
     * 将详细日志信息输出到控制台
     * 
     * @param info 详细日志信息
     */
    private _console (info: void | LogInfo): string {
        if (!info) {
            return
        }

        const colorLevel = this._colors[info.level](`[${info.level}]`)
        return `${colorLevel} ${info.time} ${info.file}:${info.line} (${info.method}) ${info.message}`
    }

    /**
     * log级别日志(正常输出)
     * 
     * @param message 日志信息
     */
    public log (message: string) {
        return console.log(`[log] ${message}`)
    }

    /**
     * info级别日志
     * 
     * @param message 日志信息
     */
    public info (message: string) {
        const logInfo = this._capture(message, 'info')
        const consoleInfo = this._console(logInfo)
        console.log(consoleInfo)
    }

    /**
     * success级别日志
     * 
     * @param message 日志信息
     */
    public success (message: string) {
        const logInfo = this._capture(message, 'success')
        const consoleInfo = this._console(logInfo)
        console.log(consoleInfo)
    }

    /**
     * warning级别日志
     * 
     * @param message 日志信息
     */
    public warn (message: string) {
        const logInfo = this._capture(message, 'warn')
        const consoleInfo = this._console(logInfo)
        console.log(consoleInfo)
    }

    /**
     * error级别日志
     * 
     * @param message 日志信息
     */
    public error (message: string) {
        const logInfo = this._capture(message, 'error')
        const consoleInfo = this._console(logInfo)
        console.log(consoleInfo)
    }
}

export = {
    get cpuNum (): number {
        const len = os.cpus().length
        return Math.max(len, 4)
    },
    logger: new Logger()
}