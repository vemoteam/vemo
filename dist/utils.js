"use strict";
const os = require("os");
const path = require("path");
// Stack trace format :
// https://github.com/v8/v8/wiki/Stack%20Trace%20API
const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
const stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;
/**
 * 自动为数字补0
 * @param num
 */
function padZero(num) {
    if (num < 10) {
        return '0' + num;
    }
    else {
        return num + '';
    }
}
/**
 * 增强型Date对象
 */
function getPowerDate() {
    const date = new Date();
    date.now = () => date.getTime() + '';
    date.format = () => {
        const year = padZero(date.getFullYear()), month = padZero(date.getMonth() + 1), day = padZero(date.getDate()), hour = padZero(date.getHours()), minute = padZero(date.getMinutes()), second = padZero(date.getSeconds());
        return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
    };
    return date;
}
/**
 * 日志类
 */
class Logger {
    constructor() {
    }
    /**
     * 捕获日志的时间、触发函数、触发文件等详细信息
     *
     * @param message 日志信息
     * @param level 日志级别
     */
    _capture(message, level) {
        const error = new Error();
        const stackList = error.stack.split('\n').slice(3);
        const sp = stackReg.exec(stackList[0]) || stackReg2.exec(stackList[0]);
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
            };
        }
    }
    /**
     * 将详细日志信息输出到控制台
     *
     * @param info 详细日志信息
     */
    _console(info) {
        if (!info) {
            return;
        }
        const str = `[${info.level}] ${info.time} ${info.file}:${info.line} (${info.method}) ${info.message}`;
        console.log(str);
    }
    /**
     * log级别日志
     *
     * @param message 日志信息
     */
    log(message) {
        const loginfo = this._capture(message, 'log');
        this._console(loginfo);
    }
    /**
     * info级别日志
     *
     * @param message 日志信息
     */
    info(message) {
        const loginfo = this._capture(message, 'info');
        this._console(loginfo);
    }
    /**
     * warning级别日志
     *
     * @param message 日志信息
     */
    warn(message) {
        const loginfo = this._capture(message, 'warn');
        this._console(loginfo);
    }
    /**
     * error级别日志
     *
     * @param message 日志信息
     */
    error(message) {
        const loginfo = this._capture(message, 'error');
        this._console(loginfo);
    }
}
module.exports = {
    get cpuNum() {
        const len = os.cpus().length;
        return Math.max(len, 4);
    },
    logger: new Logger()
};
