import mongoose from "mongoose";

const tweetsSchema = mongoose.Schema(
    {
        content: {
            type: String,
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
)

export const Tweet = mongoose.model("Tweet", tweetsSchema)