//Where our server is located
const socket = io('http://localhost:3000')
//setting variables
const messageForm = document.getElementById('text-form')
const messageInput = document.getElementById('message-input')

//
socket.on('chat-message', data => {
    console.log(data)
})

//listening to form
messageForm.addEventListener('submit', e => {
    e.preventDefault()
    //grabbing input value
    const message = messageInput.value
    //send info from client to server
    socket.emit('send-chat-message', message)
    //clears message form
    messageInput.value=''
})