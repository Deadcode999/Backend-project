import { Router } from "express";
import { logoutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { loginUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { loginUser } from "../controllers/user.controller.js";

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

export default router