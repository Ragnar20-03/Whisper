"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
class UserManager {
    constructor() {
        this.users = [];
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new UserManager();
        }
        return this.instance;
    }
    displayUsers() {
        this.users.map((user, index) => {
            console.log(index, " : ", user);
        });
    }
    addUser(userData) {
        var _a;
        console.log("user....");
        this.users.push(userData);
        let response = {
            id: "user",
            status: "success",
            msg: "Connected / Added Succesfully !"
        };
        (_a = userData.socket) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(response));
    }
    removeUser(userSocket) {
        this.users = this.users.filter(user => user.socket !== userSocket);
        let response = {
            status: "success",
            msg: "DisConnected / removed Succesfully !"
        };
        userSocket === null || userSocket === void 0 ? void 0 : userSocket.send(JSON.stringify(response));
    }
}
exports.UserManager = UserManager;
