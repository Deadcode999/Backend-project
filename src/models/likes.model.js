import mongoose from "mongoose";

const likesSchema = mongoose.Schema(
    {
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        },
        tweat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tweet"
        },
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        },
        likedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
)

export const Like = mongoose.model("Like", likesSchema)