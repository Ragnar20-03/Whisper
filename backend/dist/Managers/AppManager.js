"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppManager = void 0;
const types_1 = require("../types");
const RoomManager_1 = require("./RoomManager");
const UserManager_1 = require("./UserManager");
class AppManager {
    constructor() {
        this.roomManager = null;
        this.userManager = null;
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new AppManager();
        }
        return this.instance;
    }
    startApp() {
        this.roomManager = RoomManager_1.RoomManager.getInstance();
        this.userManager = UserManager_1.UserManager.getInstance();
    }
    handleType(type, message, socket) {
        var _a, _b, _c, _d, _e;
        if (type == types_1.INIT) {
            (_a = this.userManager) === null || _a === void 0 ? void 0 : _a.addUser({ socket: socket, username: message.username, rooms: [] });
        }
        else if (type == types_1.INIT_ROOM) {
            (_b = this.roomManager) === null || _b === void 0 ? void 0 : _b.addRoom(message.roomName, socket);
        }
        else if (type === types_1.JOIN_ROOM) {
            let user = (_c = this.userManager) === null || _c === void 0 ? void 0 : _c.users.find(u => u.socket === socket);
            if (user) {
                (_d = this.roomManager) === null || _d === void 0 ? void 0 : _d.joinRoom(message.roomCode, socket, message.roomName, user);
            }
        }
        else if (type == types_1.EXIT_ROOM) {
        }
        else if (type === types_1.NEW_MSG) {
            (_e = this.roomManager) === null || _e === void 0 ? void 0 : _e.broadCast(message.roomCode, socket, message);
        }
    }
}
exports.AppManager = AppManager;
AppManager.instance = null;
