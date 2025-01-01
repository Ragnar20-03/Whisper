import express from "express"
import http from "http"
import { WebSocket, WebSocketServer } from "ws";
import { ChatManager } from "./ChatManger";
import { EXIT, INIT, INIT_ROOM, JOIN_ROOM, NEW_MSG, } from "./types";
import { RoomManager } from "./RoomManager";

const app = express();
app.get('/', (req, res) => {
    res.status(200).json({
        msg: "Chat Application !"
    })
})

const server = http.createServer(app);
const wss = new WebSocketServer({ server })
let userConnected = 0;
let chatManger: null | ChatManager
let roomManager: null | RoomManager
let roomId = 0;

wss.on('connection', (socket: WebSocket) => {
    userConnected++;
    console.log("UserConnected : ", userConnected);
    socket.on('message', (message: string | any) => {
        try {
            let clientMessage = JSON.parse(message);
            console.log("Clinet message is : ", clientMessage)
            if (clientMessage.type == INIT) {
                chatManger?.addUser(socket, clientMessage.username)
                let response = { status: "success", type: "new_user" }
            }
            if (clientMessage.type == EXIT) {
                chatManger?.removeUser(socket);
            }
            if (clientMessage.type == INIT_ROOM) {

                const roomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
                let newRoom = roomManager?.createRoom(++roomId, clientMessage.roomName, socket, clientMessage.username, roomCode)
                let response = { status: "success", roomCode, roomName: clientMessage.roomName }
                socket.send(JSON.stringify(response));
            }
            if (clientMessage.type == JOIN_ROOM) {
                roomManager?.joinRoom(clientMessage.roomCode, socket, clientMessage.username)

            }
            if (clientMessage.type == NEW_MSG) {
                roomManager?.broadCastMessage(clientMessage.roomId, socket, clientMessage.message)
            }
        } catch (error) {
            console.log("error occuured ", error);

        }
    })
})


server.listen(5100, () => {
    chatManger = ChatManager.getInstance();
    roomManager = RoomManager.getInstance();
    console.log("Server started on port number : ", 5100);

})