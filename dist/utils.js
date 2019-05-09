const os = require('os');
module.exports = {
    get cpuNum() {
        let len = os.cpus().length;
        return Math.max(len, 4);
    }
};
