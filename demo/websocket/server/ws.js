
module.exports = (socket, ctx) => {
    setTimeout(() => {
        socket.emit('client', { hello: 'client' })
    }, 500)
    
    socket.on('server', function (data) {
        console.log(data)
    })
}