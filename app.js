
const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT

//setting up SocketIo
const http = require('http')
const socketio = require('socket.io')  //socketio runs on http server

const server = http.createServer(app); // running express server on http server

const io = socketio(server)  // running http server on socketio server

// EJS
const ejs = require('ejs')
const path = require('path')

app.set("view engine", "ejs")  
app.set(express.static(path.join(__dirname, "public")) )
app.use(express.static("public"))

io.on("connection", (socket)=>{  //accept send-location from script.js file emit

    socket.on("send-location", (data)=>{
        io.emit("receive-data", {id: socket.id, ...data}) // emitting the data to script.js
    })
    console.log("connected")

    // to remove
    socket.on("user disconnecct", (id)=>{  // to remove the marker when app closed
       
        if(markers[id])
        {
            map.removeLayer(markers[id])
            delete markers[id]
        }
    })

})

app.get("/", (req,res)=>{
    res.render("index")
})

server.listen(port, ()=>{
    console.log(`server running on ${port}`)
} )