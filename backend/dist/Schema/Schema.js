"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.startMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("../config/dotenv");
const startMongo = () => {
    mongoose_1.default.connect(dotenv_1.MONGO_URL).then((res1) => {
        console.log("Mongo Connection is Scuccesfull !");
    }).catch((err) => {
        console.log("unable to connect mongoose !");
    });
};
exports.startMongo = startMongo;
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, unique: true },
    password: String,
    fname: String,
    lname: String,
    email: String,
    freinds: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "user" }]
});
exports.User = mongoose_1.default.model('user', userSchema);
