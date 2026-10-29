import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

router.route("/logout").get(verifyJwt, logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/update-password").post(verifyJwt, changeCurrentPassword)

router.route("/get-current-user").post(verifyJwt, getCurrentUser)



export default router