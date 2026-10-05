import { configDotenv } from "dotenv";
import { connectDB } from "./db/db.js";
import { app } from "./app.js";

configDotenv();

connectDB().then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running.`)
    })
}).catch((err) => {
    console.log("Database connection failure")
})


