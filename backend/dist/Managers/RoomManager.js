"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
const types_1 = require("../types");
class RoomManager {
    constructor() {
        this.rooms = [];
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new RoomManager();
        }
        return this.instance;
    }
    addRoom(roomName, socket) {
        const roomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
        let users = [];
        users.push(socket);
        let room = { users, roomName: roomName, roomCode: roomCode, admin: socket, messages: [] };
        this.rooms.push(room);
        let response = {
            status: "success",
            msg: " Room Created Succesfully !",
            room: { roomName, roomCode }
        };
        console.log("room Created Succesfully !");
        socket.send(JSON.stringify(response));
    }
    joinRoom(roomCode, socket, user) {
        let room = this.rooms.find(r => r.roomCode === roomCode);
        if (room) {
            room.users.push(socket);
            let response = {
                id: "room",
                status: "success",
                msg: "Room Joined Succesfully",
                roomName: room.roomName,
                roomCode: room.roomCode
            };
            console.log(response);
            socket.send(JSON.stringify(response));
            return true;
        }
        else {
            let response = {
                status: "failed",
                msg: "No Such Room ",
            };
            socket.send(JSON.stringify(response));
        }
    }
    broadCast(roomCode, socket, ClientMessage) {
        let room = this.rooms.find(r => r.roomCode === roomCode);
        if (room) {
            let msg = { type: types_1.IN_MSG, username: ClientMessage.username, message: ClientMessage.message, timestamp: new Date() };
            room.users.forEach((socket) => {
                socket.send(JSON.stringify(msg));
            });
        }
    }
}
exports.RoomManager = RoomManager;
RoomManager.instance = null;
