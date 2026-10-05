import mongoose from "mongoose";

const videoSchema = mongoose.Schema({
    videoFile: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    duration: {
        type: Number,
    },
    views: {
        type: Number,
        default:0
    },
    isPublished: {
        type: Boolean,
    }
},
    { timestamps: true })

export const Video = mongoose.model("Video", userSchema)