import mongoose from "mongoose";
import { MONGO_URL } from "../config/dotenv";

export const startMongo = () => {
    mongoose.connect(MONGO_URL).then((res1) => {
        console.log("Mongo Connection is Scuccesfull !");
    }).catch((err) => {
        console.log("unable to connect mongoose !");

    })
}

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    fname: String,
    lname: String,
    email: String,
    freinds: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]
})


export const User = mongoose.model('user', userSchema);

