const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const path = require('path')

const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const messageFormat = require('./utils/messages')
const { userJoin, userLeave, getRoomUsers, getCurrentUser } = require('./utils/users')

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'views')))


// chat logic

// Connection 
io.on('connection', socket => {
    // console.log("new ws connection")
    const bot = 'admin'

    // Getting user and room data
    socket.on('joinRoom', ({ username, room }) => {
        // 
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)

        // Other operations as welcoming and broadcasting about joinings we gonna do below
        // On first room-entering
        socket.emit('message', messageFormat(bot, `${user.username}, welcome to our chat application`))

        // Broadcasting eveybody that user joined chat
        socket.broadcast.to(user.room).emit('message', messageFormat(bot, `${user.username} joined to the chat`))

        // Sending general data about users in the room and room
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })



    // catching data-message from frontend and showing it to all
    socket.on('message', message => {
        const user = getCurrentUser(socket.id)
        io.emit('message', messageFormat(user.username, message))
    })


    // User disconnection
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)

        if (user) {
            io.to(user.room).emit('message', messageFormat(bot, `${user.username} left the chat`))
        }
        
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })
})


server.listen(port, () => console.log(`App is on port: ${port}`))