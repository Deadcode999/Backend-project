import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/webapp`)
        console.log(`Database Connected Sucessfully : Host:${connectionInstance.connection.host}`) 
    } catch (error) {
        console.error("Database Connection Failed ! :",error)
        throw error
    }
}

export {connectDB}