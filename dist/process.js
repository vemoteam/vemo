// const path = require('path')
const cluster = require('cluster');
const utils = require('./utils');
const { ConfigRootNotExist, VemoFileNotExist } = require('./error');
const liveTime = 60 * 60 * 1000; //子进程生命周期
const restartSpaceTime = 60 * 1000; //重启间隔时间，避免全部一起重启导致服务不可用
const heartBeatKillTime = 60 * 1000; //心跳包最大间隔，超出此时间则认为进程已经不正常死亡，触发重启
let workerCreateTime = {}; //子进程创建时间存在这里
let lastRestartTime = 0; //上一次子进程重启时间
let heartBeatTime = {}; //接收到心跳包时间
let lastWorkKillTime = 0; //上次进程杀死时间
function timer(cb) {
    cb(Date.now());
    setTimeout(function () {
        timer(cb);
    }, 1000);
}
function killWorker(id) {
    delete heartBeatTime[id];
    //杀进程的最小间隔设置为15s，避免一起杀死出问题
    if (Date.now() - lastWorkKillTime < 15000) {
        setTimeout(function () {
            killWorker(id);
        }, 15000 - (Date.now() - lastWorkKillTime));
        return;
    }
    lastWorkKillTime = Date.now();
    //先启动一个新进程，再杀掉一个进程，避免一个进程都没有在跑造成业务无响应
    let worker = cluster.fork();
    workerCreateTime[worker.id] = Date.now();
    heartBeatTime[worker.id] = Date.now();
    delete workerCreateTime[id];
    worker.on('message', function (msg) {
        if (msg == 'killSelf') {
            killWorker(worker.id);
        }
        else if (msg === 'heartBeat') {
            heartBeatTime[worker.id] = +new Date();
        }
    });
    //如果当前worker还存在的话，先断开链接，停止接受请求，2s后杀掉
    cluster.workers[id] && cluster.workers[id].kill && (function () {
        let currentWorker = cluster.workers[id];
        currentWorker.disconnect();
        setTimeout(function () {
            currentWorker.kill();
            console.log('[vemo] worker ' + id + ' killed!');
        }, 2000);
    }());
    return worker.id;
}
function restartWorker() {
    timer(function (ts) {
        // 每秒检查所有进程的启动时间，是否超过生命周期
        if (ts - lastRestartTime < restartSpaceTime) {
            //如果距离上次重启时间太短，则跳过
            return;
        }
        for (let key in workerCreateTime) {
            if (workerCreateTime.hasOwnProperty(key)) {
                if (ts - workerCreateTime[key] > liveTime) {
                    lastRestartTime = ts;
                    killWorker(key);
                    break;
                }
            }
        }
    });
}
function init() {
    // 新的工作子进程
    let newWorker;
    if (cluster.isMaster) {
        //启动相当于物理核心个数的进程
        for (let i = 0; i < utils.cpuNum; i++) {
            newWorker = cluster.fork();
            workerCreateTime[newWorker.id] = Date.now();
            heartBeatTime[newWorker.id] = Date.now();
        }
        Object.keys(cluster.workers).forEach(function (id) {
            cluster.workers[id].on('message', function (msg) {
                if (msg === 'killSelf') {
                    killWorker(id);
                }
                else if (msg === 'heartBeat') {
                    if (heartBeatTime[id]) {
                        heartBeatTime[id] = +new Date();
                    }
                }
                else if (msg === 'killMaster') {
                    process.exit();
                }
            });
        });
        // 重启 worker
        restartWorker();
        // 定时检查进程是否有响应
        timer(function (ts) {
            let workers = [];
            Object.keys(cluster.workers).forEach(function (id) {
                workers.push(id);
            });
            for (let id of workers) {
                //检查进程是否还存活，isDead的话杀掉
                if (cluster.workers[id] && !cluster.workers[id].isDead()) {
                    // 如果进程没有死亡，则不做任何工作
                }
                else {
                    // 如何死亡，则强制 kill
                    cluster.workers[id] && cluster.workers[id].kill && cluster.workers[id].kill();
                }
            }
            //检查心跳包时间
            for (let id in heartBeatTime) {
                if (heartBeatTime.hasOwnProperty(id)) {
                    if (ts - heartBeatTime[id] > heartBeatKillTime) {
                        console.error('[vemo] process[' + id + '] heart beat timeout, kill it!');
                        killWorker(id);
                    }
                }
            }
        });
    }
    else if (cluster.isWorker) {
        try {
            require('./index');
        }
        catch (err) {
            if (err.code === VemoFileNotExist
                || err.code === ConfigRootNotExist) {
                process.send('killMaster');
            }
            else {
                console.error('Uncaught Error:\n', err.code, err.message, err.stack || '');
            }
        }
        process.on('uncaughtException', (err) => {
            // 端口被占用，则直接退出进程
            if (err.code === 'EADDRINUSE') {
                process.send('killMaster');
            }
            console.error('Uncaught Error:\n', err.code, err.message, err.stack || '');
        });
        let lastUpdate = Date.now();
        let lastMemCheck = Date.now();
        timer(function (ts) {
            //10s发送一次心跳包
            if (ts - lastUpdate > 10000) {
                try {
                    process.send('heartBeat');
                }
                catch (e) {
                    console.error(e);
                }
                lastUpdate = ts;
            }
        });
        //每30s检查内存占用，占用过多的话，kill之
        timer(function (ts) {
            if (ts - lastMemCheck > 30 * 1000) {
                if (process.memoryUsage().heapTotal > 5E8) {
                    console.log('[vemo]  MemoryOverflow：' + process.memoryUsage().heapTotal);
                    process.send('killSelf');
                }
                lastMemCheck = ts;
            }
        });
    }
}
// 触发所有进程开始重启
function reload() {
    for (let key in workerCreateTime) {
        if (workerCreateTime.hasOwnProperty(key)) {
            workerCreateTime[key] = 0;
        }
    }
}
exports.init = init;
exports.reload = reload;
