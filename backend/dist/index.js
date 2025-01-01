"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const ChatManger_1 = require("./ChatManger");
const types_1 = require("./types");
const RoomManager_1 = require("./RoomManager");
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.status(200).json({
        msg: "Chat Application !"
    });
});
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
let userConnected = 0;
let chatManger;
let roomManager;
let roomId = 0;
wss.on('connection', (socket) => {
    userConnected++;
    console.log("UserConnected : ", userConnected);
    socket.on('message', (message) => {
        try {
            let clientMessage = JSON.parse(message);
            console.log("Clinet message is : ", clientMessage);
            if (clientMessage.type == types_1.INIT) {
                chatManger === null || chatManger === void 0 ? void 0 : chatManger.addUser(socket, clientMessage.username);
                let response = { status: "success", type: "new_user" };
            }
            if (clientMessage.type == types_1.EXIT) {
                chatManger === null || chatManger === void 0 ? void 0 : chatManger.removeUser(socket);
            }
            if (clientMessage.type == types_1.INIT_ROOM) {
                const roomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
                let newRoom = roomManager === null || roomManager === void 0 ? void 0 : roomManager.createRoom(++roomId, clientMessage.roomName, socket, clientMessage.username, roomCode);
                let response = { status: "success", roomCode, roomName: clientMessage.roomName };
                socket.send(JSON.stringify(response));
            }
            if (clientMessage.type == types_1.JOIN_ROOM) {
                roomManager === null || roomManager === void 0 ? void 0 : roomManager.joinRoom(clientMessage.roomCode, socket, clientMessage.username);
            }
            if (clientMessage.type == types_1.NEW_MSG) {
                roomManager === null || roomManager === void 0 ? void 0 : roomManager.broadCastMessage(clientMessage.roomId, socket, clientMessage.message);
            }
        }
        catch (error) {
            console.log("error occuured ", error);
        }
    });
});
server.listen(5100, () => {
    chatManger = ChatManger_1.ChatManager.getInstance();
    roomManager = RoomManager_1.RoomManager.getInstance();
    console.log("Server started on port number : ", 5100);
});
