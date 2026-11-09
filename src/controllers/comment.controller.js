import { Comment } from "../models/comments.model.js"

const addComment = async (req, res) => {
    const { videoId } = req.params
    const { content } = req.body

    if (!content || !videoId) {
        return res.status(400).json({ message: "Field are required and cannot be empty." })
    }

    const comment = await Comment.Create({
        content,
        video: videoId,
        owner: req.user?._id
    })

    return res.
        status(200).
        json(new apiResponse(200, comment, "Tweet created successfully."))
}

const getVideoComments = async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        return res.status(400).json({ message: "Field are required and cannot be empty." })
    }

    const videoComment = await Comment.find({ video: videoId })

    return res.
        status(200).
        json(new apiResponse(200, videoComment, "Tweet created successfully."))
}

const updateComment = async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body

    if (!commentId || !content) {
        return res.status(400).json({ message: "Field are required and cannot be empty." })
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: { content: content }
        },
        {
            new: true
        }
    )

    return res.
        status(200).
        json(new apiResponse(200, updatedComment, "Tweet created successfully."))
}

const deleteComment = async (req, res) => {
    const { commentId } = req.params

    if (!commentId) {
        return res.status(400).json({ message: "Comment ID is required." });
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId)

    if (!deleteComment) {
        return res.status(404).json({ message: "Comment already deleted or never existed." });
    }

    return res.
        status(200).
        json(new apiResponse(200, deletedComment, "Tweet delete successfully."))
}

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}