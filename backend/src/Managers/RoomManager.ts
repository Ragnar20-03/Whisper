import WebSocket from "ws";
import { IUser } from "./UserManager";

interface IMessage {
    socket?: WebSocket,
    username: string,
    message: string | any,
    timestamp: Date
}

export interface IRoom {
    roomName: string,
    admin: WebSocket,
    roomCode: string | any,
    users: WebSocket[],
    messages: IMessage[]
}

export class RoomManager {
    private static instance: RoomManager | null = null;
    rooms: IRoom[] = []
    public static getInstance() {
        if (!this.instance) {
            this.instance = new RoomManager();
        }
        return this.instance
    }

    addRoom(roomName: string, socket: WebSocket,) {


        const roomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
        let users: WebSocket[] = []
        users.push(socket);
        let room: IRoom = { users, roomName: roomName, roomCode: roomCode, admin: socket, messages: [] }
        this.rooms.push(room)
        let response = {
            status: "success",
            msg: " Room Created Succesfully !",
            room: { roomName, roomCode }
        }
        socket.send(JSON.stringify(response))
    }

    joinRoom(roomCode: string, socket: WebSocket, roomName: string, user: IUser) {
        let room: IRoom | undefined = this.rooms.find(r => r.roomCode === roomCode)
        if (room) {
            room.users.push(socket)
            let response = {
                status: "success",
                msg: "Room Joined Succesfully"
            }
            socket.send(JSON.stringify(response));
            return true
        }
        else {
            let response = {
                status: "failed",
                msg: "No Such Room "
            }
            socket.send(JSON.stringify(response));
        }
    }

    broadCast(roomCode: string, socket: WebSocket, ClientMessage: string | any) {
        let room = this.rooms.find(r => r.roomCode === roomCode)
        if (room) {
            let msg: IMessage = { username: ClientMessage.username, message: ClientMessage.message, timestamp: new Date() }
            room.users.forEach((socket) => {
                socket.send(JSON.stringify(msg))
            })
        }
    }
}