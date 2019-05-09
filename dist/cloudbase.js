"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 生产环境的时候，获取临时密钥 将临时密钥存放在某个位置/内存，有需要用的时候就读取。即将过期的时候就得新拉取。如果没，就读取 vemofile.js 里的永久配置。
// 开发环境的时候，读取环境变量里的密钥，如果没，则读取vemofile.js里配置的永久密钥
// 将 tcb-admin-node 注入到 ctx 中
const ini = require('ini');
const os = require("os");
const path = require("path");
const fs = require("fs");
const tcb = require('tcb-admin-node');
const axios = require('axios');
const isProduction = process.env.NODE_ENV === 'production';
const TCBRC = path.resolve(os.homedir(), '.tcbrc.json');
// 在本地开发时，通过 .tcbrc.json 文件获取密钥
async function getLocalSecret() {
    if (fs.existsSync(TCBRC)) {
        const tcbrc = ini.parse(fs.readFileSync(TCBRC, 'utf-8'));
        if (tcbrc.secretId && tcbrc.secretKey) {
            process.env.TENCENTCLOUD_SECRETID = tcbrc.secretId;
            process.env.TENCENTCLOUD_SECRETKEY = tcbrc.secretKey;
        }
    }
}
// 在云主机中获取临时密钥
async function getTempSecret(retryTimes = 0, maxRetryTimes) {
    try {
        let result = await axios.get('http://metadata.tencentyun.com/meta-data/cam/security-credentials/PAI_QCSRole');
        let secret = result.data;
        // console.log(secret)
        process.env.TENCENTCLOUD_SECRETID = secret.TmpSecretId;
        process.env.TENCENTCLOUD_SECRETKEY = secret.TmpSecretKey;
        process.env.TENCENTCLOUD_SESSIONTOKEN = secret.Token;
        process.env.TENCENTCLOUD_SECRETEXPIRE = String(secret.ExpiredTime - 600); // 提早10分钟重新拉取，单位秒
    }
    catch (e) {
        console.error('[vemo] fail to get tencent cloud temporary secret.');
        console.error(e.stack);
        // 如果获取失败则重试，最多3次
        if (retryTimes < maxRetryTimes) {
            ++retryTimes;
            console.log(`retry getTempSecret: ${retryTimes} time`);
            getTempSecret(retryTimes, maxRetryTimes);
        }
    }
}
module.exports = (options = {}) => {
    let { secretId, secretKey, env, maxRetryTimes = isProduction ? 3 : 0 } = options;
    // 在 vemofile.js 里填写永久 secretId 和 secretKey 的情况
    if (!process.env.TENCENTCLOUD_SECRETID && secretId) {
        process.env.TENCENTCLOUD_SECRETID = secretId;
    }
    if (!process.env.TENCENTCLOUD_SECRETKEY && secretKey) {
        process.env.TENCENTCLOUD_SECRETKEY = secretKey;
    }
    if (!process.env.TCB_ENV && env) {
        process.env.TCB_ENV = env;
    }
    getLocalSecret();
    return async (ctx, next) => {
        // 拉取临时密钥的逻辑
        if (!process.env.TENCENTCLOUD_SECRETID && !process.env.TENCENTCLOUD_SECRETKEY) {
            await getTempSecret(0, maxRetryTimes);
        }
        // 临时密钥过期，重新拉取 （如果有 TENCENTCLOUD_SESSIONTOKEN, 表示这必定是临时密钥）
        let isExpire = Math.floor(Date.now() / 1000) > +process.env.TENCENTCLOUD_SECRETEXPIRE;
        if (process.env.TENCENTCLOUD_SESSIONTOKEN && isExpire) {
            await getTempSecret(0, maxRetryTimes);
        }
        tcb.init({
            env: process.env.TCB_ENV
        });
        ctx.tcb = tcb; // 上下文挂载
        await next();
    };
};
