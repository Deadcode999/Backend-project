import { Subscribe } from "../models/subscription.model"

const toggleSubscription = async (req, res) => {
    const { channelId } = req.params

    if (!channelId) {
        return res.status(400).json({ message: "Channel ID is required." });
    }

    const isSubscribe = await Subscribe.findOne(
        {
            channel: channelId,
            subscriber: req.user?._id
        }
    )

    if (isSubscribe) {
        return res.status(400).json({ message: "Channel already subscribed." });
    }

    const subscribed = await Subscribe.create(
        {
            channel: channelId,
            subscriber: req.user?._id
        }
    )

    return res.
        status(200).
        json(new apiResponse(200, subscribed, "Channel subscribed successfully."))

}

const getUserChannelSubscribers = async (req, res) => {
    const { channelId } = req.params
}

const getSubscribedChannels = async (req, res) => {
    const { subscriberId } = req.params
}

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}