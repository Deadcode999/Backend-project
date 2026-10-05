import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    coverimage: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    watchHistory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Video
    }
},
    { timestamps: true })

export const User = mongoose.model("User",userSchema)