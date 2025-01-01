"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatManager = void 0;
class ChatManager {
    constructor() {
        this.users = [];
        this.users = [];
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ChatManager();
        }
        return this.instance;
    }
    addUser(socket, userName) {
        this.users.push({ userSocket: socket, userName: userName });
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user.userSocket !== socket);
    }
}
exports.ChatManager = ChatManager;
ChatManager.instance = null;
