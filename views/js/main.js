const socket = io()
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
const chatForm = document.querySelector('#chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const usersNames = document.getElementById('users')

// console.log(username, room)

// ON JOINING CHAT FROM FRONTENT WE GET DATA OF USER AND ROOM 
socket.emit('joinRoom', { username, room })


// MESSAGE OUTPUTS ON UI
socket.on('message', message => {
    // console.log(message)

    outputMessage(message)
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Room and users data 

socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room)
    outputRoomUsers(users)
})

chatForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const msg = event.target.elements.msg.value;

    socket.emit('message', msg)

    event.target.elements.msg.value = null
    event.target.elements.msg.focus()
})


function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `
        <p class="meta">${message.username} <span>${message.timestamp}</span></p>
        <p class="text">
            ${message.text}
        </p>
    `
    document.querySelector('.chat-messages').appendChild(div)
}

function outputRoomName(room) {
    roomName.innerText = room
}

function outputRoomUsers(users) {
    usersNames.innerHTML = `
        ${users.map(user => `<li>${user}</li>`).join('')}
    `
}