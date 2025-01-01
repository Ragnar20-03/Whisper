"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
class RoomManager {
    constructor() {
        this.rooms = [];
        this.rooms = [];
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new RoomManager();
        }
        return this.instance;
    }
    createRoom(roomId, roomName, socket, username, roomCode) {
        let newRoom = { roomName, roomId, users: [{ username: username, socket: socket }], roomCode };
        this.rooms.push({ roomName, roomId, users: [{ username: username, socket: socket }], roomCode });
        return newRoom;
    }
    deleteRoom(roomId) {
        this.rooms = this.rooms.filter(room => room.roomId !== roomId);
    }
    joinRoom(roomCode, socket, username) {
        let room = this.rooms.find(r => r.roomCode === roomCode);
        if (!room) {
            let response = { status: "failed", msg: "No Such room" };
            socket.send(JSON.stringify(response));
        }
        else {
            room.users.push({ username: username, socket: socket });
            let response = { status: "success", msg: "Room Join Succesfully !" };
            socket.send(JSON.stringify(response));
        }
    }
    broadCastMessage(roomId, socket, message) {
        var _a;
        const room = this.rooms.find(r => r.roomId === roomId);
        if (!room) {
            console.log("room Not Fouund");
        }
        else {
            (_a = room.users) === null || _a === void 0 ? void 0 : _a.forEach(userSocket => {
                let response = { type: "new_message", message, from: userSocket.username };
                userSocket.socket.send(JSON.stringify(response));
            });
        }
    }
}
exports.RoomManager = RoomManager;
