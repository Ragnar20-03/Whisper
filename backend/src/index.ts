import express, { Request, Response } from "express";
import http from "http"
import WebSocket, { WebSocketServer } from "ws";
import { EXIT_ROOM, INIT, INIT_ROOM, JOIN_ROOM } from "./types";
import { AppManager } from "./Managers/AppManager";
import cors from "cors"

const app = express();
app.use(cors())
let appManager: AppManager | null = null;

app.get('/', (req: Request, res: Response) => {
    // console.log("chat application !");
    res.json({
        msg: " Chat Application !"
    })
})

const server = http.createServer(app)
const wss = new WebSocketServer({ server })

wss.on('connection', (socket: WebSocket) => {
    console.log("user connected !");
    socket.on("message", (message: string | any) => {
        let clientMessage = JSON.parse(message)
        console.log("client message is : ", clientMessage);

        let type = clientMessage.type
        appManager?.handleType(type, clientMessage, socket)
    })

    socket.on('close', () => {
        console.log("scoket is closing ");

    })
})

server.listen(5100, '0.0.0.0', () => {

    console.log("welcomw to chat application !");
    appManager = AppManager.getInstance();
    appManager.startApp()
})