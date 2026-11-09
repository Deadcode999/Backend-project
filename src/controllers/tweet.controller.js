import { Tweet } from "../models/tweets.model.js"
import { apiResponse } from "../utils/ApiResponse.js"

const createTweet = async (req, res) => {
    const { content } = req.body

    if (!content) {
        return res.status(400).json({ message: "Field are required and cannot be empty." })
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    })

    return res.
        status(200).
        json(new apiResponse(200, tweet, "Tweet created successfully."))
}

const getUserTweets = async (req, res) => {

    const tweet = await Tweet.find({ owner: req.user?._id })

    return res.
        status(200).
        json(new apiResponse(200, tweet, "Tweet found successfully."))
}

const updateTweet = async (req, res) => {
    const { tweetId } = req.params

    if (!req.body) {
        return res.status(400).json({ message: "Field are required and cannot be empty." })
    }

    const { content } = req.body

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: { content }
        },
        {
            new: true
        }

    )

    return res.
        status(200).
        json(new apiResponse(200, updatedTweet, "Tweet update successfully."))
}

const deleteTweet = async (req, res) => {
    const { tweetId } = req.params

    if (!tweetId) {
        return res.status(400).json({ message: "Tweet ID is required." });
    }


    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    if (!deletedTweet) {
        return res.status(404).json({ message: "Tweet already deleted or never existed." });
    }

    return res.
        status(200).
        json(new apiResponse(200, deletedTweet, "Tweet delete successfully."))
}

export { createTweet, getUserTweets, updateTweet, deleteTweet }