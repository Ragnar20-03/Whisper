import { response } from "express"
import WebSocket = require("ws")

interface IUser {
    username: string,
    socket: WebSocket
}

interface IRoom {
    roomName: string,
    roomId: any,
    roomCode: any
    users: IUser[]
}

export class RoomManager {
    private static instance: RoomManager | null
    rooms: IRoom[] = []
    constructor() {
        this.rooms = []
    }
    public static getInstance() {
        if (!this.instance) {
            this.instance = new RoomManager();
        }
        return this.instance
    }
    createRoom(roomId: any, roomName: string, socket: WebSocket, username: string, roomCode: any,) {
        let newRoom = { roomName, roomId, users: [{ username: username, socket: socket }], roomCode }
        this.rooms.push({ roomName, roomId, users: [{ username: username, socket: socket }], roomCode });
        return newRoom
    }

    deleteRoom(roomId: any) {
        this.rooms = this.rooms.filter(room => room.roomId !== roomId)
    }

    joinRoom(roomCode: any, socket: WebSocket, username: string) {
        let room = this.rooms.find(r => r.roomCode === roomCode)
        if (!room) {
            let response = { status: "failed", msg: "No Such room" }
            socket.send(JSON.stringify(response))
        }
        else {
            room.users.push({ username: username, socket: socket });
            let response = { status: "success", msg: "Room Join Succesfully !" }
            socket.send(JSON.stringify(response));
        }
    }
    broadCastMessage(roomId: any, socket: WebSocket, message: string | any) {
        const room = this.rooms.find(r => r.roomId === roomId)
        if (!room) {
            console.log("room Not Fouund");
        }
        else {
            room.users?.forEach(userSocket => {
                let response = { type: "new_message", message, from: userSocket.username }
                userSocket.socket.send(JSON.stringify(response));
            })
        }
    }
}