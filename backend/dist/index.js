"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const AppManager_1 = require("./Managers/AppManager");
const app = (0, express_1.default)();
let appManager = null;
app.get('/', (req, res) => {
    // console.log("chat application !");
    res.json({
        msg: " Chat Application !"
    });
});
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
wss.on('connection', (socket) => {
    console.log("user connected !");
    socket.on("message", (message) => {
        let clientMessage = JSON.parse(message);
        console.log("client message is : ", clientMessage);
        let type = clientMessage.type;
        appManager === null || appManager === void 0 ? void 0 : appManager.handleType(type, clientMessage, socket);
    });
    socket.on('close', () => {
        console.log("coket is closing ");
    });
});
server.listen(5100, () => {
    console.log("welcomw to chat application !");
    appManager = AppManager_1.AppManager.getInstance();
    appManager.startApp();
});
