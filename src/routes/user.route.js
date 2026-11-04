import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateFullname,
    updateAvatar,
    updateCoverImage,
    getChannel,
    getWatchHistory
}
    from "../controllers/user.controller.js";
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

router.route("/get-current-user").get(verifyJwt, getCurrentUser)

router.route("/update-fullname").patch(verifyJwt, updateFullname)

router.route("/update-avatar").patch(verifyJwt, upload.single("avatar"), updateAvatar)

router.route("/update-cover-image").patch(verifyJwt, upload.single("coverImage"), updateCoverImage)

router.route("/channels/:username").get(verifyJwt, getChannel)

router.route("/history/watch").get(verifyJwt, getWatchHistory)

export default router 