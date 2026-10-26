import { configDotenv } from "dotenv";
configDotenv();
import { connectDB } from "./db/db.js";
import { app } from "./app.js";


connectDB().then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running on http://localhost:3000/register`)
    })
}).catch((err) => {
    console.log("Database connection failure")
})


