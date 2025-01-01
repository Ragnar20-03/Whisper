import WebSocket = require("ws")
interface IUSer {
    userSocket: WebSocket | null,
    userName: string
}

export class ChatManager {
    users: IUSer[] = []
    private static instance: null | ChatManager = null
    constructor() {
        this.users = []
    }
    static getInstance() {
        if (!this.instance) {

            this.instance = new ChatManager();
        }
        return this.instance
    }

    addUser(socket: WebSocket, userName: string) {
        this.users.push({ userSocket: socket, userName: userName });
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user.userSocket !== socket)
    }
}