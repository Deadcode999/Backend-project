import jwt from "jsonwebtoken"
import { User } from "../models/users.model"

const verifyJwt = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken

        if (!token) {
            return res.status(401).json({ message: "Invalid Access Token!" })
        }

        const decodedToken = jwt.verify(!accessToken, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findOne({ _id: decodedToken._id }).select(
            "-password -refreshToken"
        )

        if (!user) {
            return res.status(401).json({ message: "Invalid Access Token!" })
        }

        req.user = user

        next()
    } catch (error) {
        console.error(error)
    }

}

export {verifyJwt}