const socket = io()

// socket.emit('message', 'Client sending message')
const input = document.getElementById('text')
const log = document.getElementById('mensajes')

input.addEventListener('keyup', event => {
    if (event.key==="Enter"){
        socket.emit('message2', input.value)
        input.value = ''
    }
})

socket.on('log', data =>{
    let logs = ''
    data.logs.forEach(log => {
        logs += `<li> ${log.socketid} dice: ${log.message}</li>`
    });
    log.innerHTML=logs
})