export interface IUser {
    socket: WebSocket | null,
    username: string,
    rooms: string[]
}
import WebSocket from "ws";
export class UserManager {
    private static instance: UserManager | null;
    users: IUser[] = []
    public static getInstance() {
        if (!this.instance) {
            this.instance = new UserManager()
        }
        return this.instance
    }

    displayUsers() {
        this.users.map((user, index) => {
            console.log(index, " : ", user);

        })
    }

    public addUser(userData: IUser) {
        console.log("user....");

        this.users.push(userData);
        let response = {
            id: "user",
            status: "success",
            msg: "Connected / Added Succesfully !"
        }
        userData.socket?.send(JSON.stringify(response))
    }

    removeUser(userSocket: WebSocket) {
        this.users = this.users.filter(user => user.socket !== userSocket)
        let response = {
            status: "success",
            msg: "DisConnected / removed Succesfully !"
        }
        userSocket?.send(JSON.stringify(response))

    }
}