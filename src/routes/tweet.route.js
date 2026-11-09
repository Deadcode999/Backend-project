import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet
} from "../controllers/tweet.controller.js";

const router = Router()

router.route("/create-tweet").post(verifyJwt, createTweet)

router.route("/get-user-tweet").get(verifyJwt, getUserTweets)

router.route("/update-tweet/:tweetId").patch(verifyJwt, updateTweet)

router.route("/remove-tweet/:tweetId").post(verifyJwt, deleteTweet)


export default router