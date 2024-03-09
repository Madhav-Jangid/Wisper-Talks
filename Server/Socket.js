const express = require('express');
const app = express();
const http = require("http");
const { Server } = require('socket.io');
const cors = require('cors')

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`Room is joined`,data);
    });

    socket.on("send_message", (data) => {
        console.log('message recived',data);
        socket.to(data.room).emit("receive_message", data);
    });
});

server.listen(6969, () => {
    console.log('server running on 3001')
})