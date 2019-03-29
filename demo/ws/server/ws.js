
module.exports = (io) => {
    io
    .on('connection', function (socket) {
        socket.emit('client', { hello: 'client' });
        socket.on('server', function (data) {
            console.log(data);
        })
    })
};