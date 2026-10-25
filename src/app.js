import e from "express";
import cors from "cors"

const app = e()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
}))

app.use(e.json())
app.use(e.urlencoded({extended:true}))

import userRouter from "./routes/user.route.js";

app.use("/api/v1/users",userRouter)

export {app}