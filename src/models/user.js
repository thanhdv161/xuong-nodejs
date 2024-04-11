import mongoose, { Schema } from "mongoose";

const userShema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
        minlength: 3,
        maxlength: 30
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    avatar: {
        type: String,
        default: "../upload/defaul-avatar.png"
    }
},{timestamps: true, versionKey: false});

export default mongoose.model("User", userShema);