import { Router } from "express";
import verifyJwt from "../middleware/auth.middleware.js"
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment
} from "../controllers/comment.controller.js";


const router = Router()

router.use(verifyJwt)

router.route("/create-comment/:videoId").post(addComment)

router.route("/get-video-comment/:videoId").get(getVideoComments)

router.route("/update-comment/:commentId").patch(updateComment)

router.route("/remove-comment/:commentId").post(deleteComment)
