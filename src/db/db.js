import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/webapp`)
        console.log(`Host:${connectionInstance.connection.host}`) 
    } catch (error) {
        console.error("Connection Failed ! :",error)
    }
}

export {connectDB}