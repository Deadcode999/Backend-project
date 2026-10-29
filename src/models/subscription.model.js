import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema({
    subscriber: {
       type: mongoose.Schema.Types.ObjectId,
       ref:"users"
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
},
    { timestamps: true })


export const subscribe =  mongoose.model("subscriber",subscriptionSchema)