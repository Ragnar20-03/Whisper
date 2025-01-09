
import { EXIT_ROOM, INIT, INIT_ROOM, JOIN_ROOM, NEW_MSG } from "../types";
import { IRoom, RoomManager } from "./RoomManager";
import { IUser, UserManager } from "./UserManager";
import WebSocket from "ws";
export class AppManager {
    private static instance: AppManager | null = null
    roomManager: RoomManager | null = null;
    userManager: UserManager | null = null;

    public static getInstance() {
        if (!this.instance) {
            this.instance = new AppManager();
        }
        return this.instance;
    }

    startApp() {
        this.roomManager = RoomManager.getInstance();
        this.userManager = UserManager.getInstance();
    }

    handleType(type: string, message: any, socket: WebSocket) {
        if (type == INIT) {
            this.userManager?.addUser({ socket: socket, username: message.username, rooms: [] })
        }
        else if (type == INIT_ROOM) {

            this.roomManager?.addRoom(message.roomName, socket)
        }
        else if (type === JOIN_ROOM) {
            let user = this.userManager?.users.find(u => u.socket === socket)
            if (user) {
                this.roomManager?.joinRoom(message.roomCode, socket, message.roomName, user)
            }
        }
        else if (type == EXIT_ROOM) {

        }
        else if (type === NEW_MSG) {
            this.roomManager?.broadCast(message.roomCode, socket, message)
        }
    }

}