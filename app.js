const express = require('express');
const path = require('path');
const http = require('http');
const app = express()
require('dotenv').config()
const socketio = require('socket.io');
const { emit } = require('process');
// import { Filter } from 'bad-words'
let { generateMessage } = require('./public/utils/message')
let { addUser, getUser, getUserInRoom, removeUser } = require('./public/utils/user.js')

let renderFile = path.join(__dirname, '/public')
app.use(express.static(renderFile))

let server = http.createServer(app)
let io = socketio(server)

//count program
// let count = 0
// io.on('connection', (socket) => {
//     socket.emit("updatedCount", count)

//     socket.on("inc", () => {
//         count++
//         io.emit("updatedCount", count)
//         console.log("count from app",count);
//     })

// })

//^----------welcome---------------------

let greet = "welcome"
io.on('connection', (socket) => {

    socket.on("join", (options, callback) => {      

            let { user,error } = addUser({ id: socket.id, ...options })        
       
        if (error) {
            return callback(error)
        }
        socket.join(user.room)

        socket.emit("greeting", generateMessage("Admin",greet))
        socket.broadcast.to(user.room).emit("greeting", generateMessage("Admin",`${user.username} has joined`))
        console.log(user);
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserInRoom(user.room)
        })
        callback()
    })
    socket.on('click', (message, callback) => {
        let user = getUser(socket.id)
        console.log(user);
        io.to(user.room).emit("greeting", generateMessage(user.username,message))
        callback()
    })


    //^--------------------------------------------------
    //^ extra thing by me
    // socket.on('msgToSender',(msg)=>{
    //     socket.broadcast.emit("greeting",msg)
    // })
    //^--------------------------------------------------

    socket.on("location", ({ latitude, longitude }, callback) => {
        let user = getUser(socket.id)
        // console.log(username);
        io.to(user.room).emit("locationMessage", generateMessage(user.username,`https://google.com/maps?q=${latitude},${longitude}`))
        callback("good job")
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit("greeting", generateMessage("Admin",`${user.username} left `))
            io.to(user.room).emit('roomData',{
                room:user.room,
                user:getUserInRoom(user.room)
            })
        }
    })
})



let PORT = process.env.PORT || 5000
server.listen(PORT, (req, res) => {

    console.log("server is running at port ", PORT);

})