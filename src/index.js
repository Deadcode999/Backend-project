import { configDotenv } from "dotenv";
configDotenv();
import { connectDB } from "./db/db.js";
import { app } from "./app.js";


connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on http://localhost:process.env.PORT`)
    })
}).catch((err) => {
    console.log("Database connection failure")
})


