const spawn = require('child_process').spawn;
const process = require('process');

let p = spawn('node',['../index.js'], {
        detached : true
});
console.log(process.pid, p.pid);
process.exit(0);