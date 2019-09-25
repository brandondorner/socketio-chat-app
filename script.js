//Where our server is located
const socket = io('http://localhost:3000')
//setting variables
const messageForm = document.getElementById('text-form')
const messageInput = document.getElementById('message-input')
const messageContainer = document.getElementById('message-container')

//whenever a message is sent, run this function
socket.on('chat-message', data => {
    appendMessage(data)
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

//takes incoming message and creates a new div with message text
const appendMessage = (message) => {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
}