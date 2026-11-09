import e from "express";
import cors from "cors"
import cookieParser from 'cookie-parser';

const app = e()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
}))

app.use(e.json())
app.use(e.urlencoded({extended:true}))
app.use(cookieParser())

import userRouter from "./routes/user.route.js";
import tweetRouter from "./routes/tweet.route.js"

app.use("/api/v1/users",userRouter)
app.use("/api/v1/tweet",tweetRouter)


export {app}