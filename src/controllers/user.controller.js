import { User } from "../models/users.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { apiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"


const generateAccessAndRefreshToken = async (user_id) => {
    try {
        const user = await User.findOne({ _id: user_id })
        const accessToken = user.genAccessToken()
        const refreshToken = user.genRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        console.error("error while generating Access and Refresh Token!", error)
    }
}

const registerUser = async (req, res) => {
    const { username, fullname, email, password } = req.body

    if ([username, fullname, email, password].some(field => !field || !field.trim)) {
        return res.status(400).json({ message: "All fields are required and cannot be empty." })
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUser) {
        return res.status(409).json({
            message: "User with this email or username already exists."
        })
    }

    const avatarPath = req.files?.avatar?.[0]?.path
    const coverImagePath = req.files?.coverImage?.[0]?.path

    if (!avatarPath) {
        return res.status(400).json({ message: "Avatar file is required." })
    }

    const avatar = await uploadOnCloudinary(avatarPath)
    const coverImage = await uploadOnCloudinary(coverImagePath)

    if (!avatar) {
        return res.status(400).json({ message: "file is required." })
    }

    const user = await User.create({
        username: username.toLowerCase(),
        fullname: fullname,
        email: email,
        password: password,
        avatar: avatar.url,
        coverimage: coverImage?.url || ""
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        return res.status(500).json({ message: "Something went wrong while registring user." })
    }

    res.status(200).json(
        new apiResponse(200, createdUser, "user registered successfully")
    )

}

const loginUser = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: "All feild are required." })
    }

    const user = await User.findOne({ username: username })

    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" })
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid username or password" })
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(200, { loggedInUser, accessToken, refreshToken }, "User login successfully.")
        )
}

const logoutUser = async (req, res) => {
    const user = req.user

    await User.findByIdAndUpdate(
        user._id,
        {
            $unset: { refreshToken: 1 }
        },
        { new: true }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new apiResponse(200, {}, "User logged out successfully.")
        )

}

const refreshAccessToken = async (req, res) => {
    const token = req.cookies?.refreshToken

    if (!token) {
        return res.status(401).json({ message: "Unauthorized token!" })
    }

    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id)

    if (!user) {
        return res.status(401).json({ message: "Unauthorized token!" })
    }

    if (token !== user.refreshToken) {
        return res.status(401).json({ message: "refresh token is expired or used." })
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(200, { accessToken, refreshToken }, "Token refresh successfully.")
        )
}

const changeCurrentPassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body

    if (!oldPassword || !newPassword || !confirmPassword) {
        res.status(400).json({ message: "All field are required." })
    }

    if (newPassword !== confirmPassword) {
        res.status(401).json({ message: "New password and Confirm password must be same." })
    }

    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        res.status(401).json({ message: "Invalid password !" })
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200)
        .json(new apiResponse(200, {}, "password chnage successfully."))

}

const getCurrentUser = async (req, res) => {
    const user = req.user

    return res.status(200)
        .json(new apiResponse(200, user, "User found successfully."))
}

const updateFullname = async (req, res) => {

    const { newFullname } = req.body

    if (!newFullname) {
        res.status(400).json({ message: "All field are required." })
    }

    const user = req.user

    const updatedUser = await User.findByIdAndUpdate(user?._id,
        {
            $set: { fullname: newFullname }
        },
        {
            new: true
        }).select(
            "-password -refreshToken"
        )

    return res.status(200)
        .json(new apiResponse(200, updatedUser, "User updated successfully."))
}

const updateAvatar = async (req, res) => {
    const avatarPath = req.file?.path

    if (!avatarPath) {
        return res.status(400).json({ message: "Avatar file is required." })
    }

    const avatar = await uploadOnCloudinary(avatarPath)?.url

    if (!avatar) {
        return res.status(500).json({ message: "Error while uploading in cloudinary!" })
    }

    const updatedUser = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: { avatar }
        },
        { new: true }).select(
            "-password -refreshToken"
        )


    return res.status(200)
        .json(new apiResponse(200, updatedUser, "User updated successfully."))

}

const updateCoverImage = async (req, res) => {
    const coverImagePath = req.file?.path

    if (!coverImagePath) {
        return res.status(400).json({ message: "Avatar file is required." })
    }

    const coverImage = await uploadOnCloudinary(coverImagePath)?.url

    if (!coverImage) {
        return res.status(500).json({ message: "Error while uploading on cloudinary!" })
    }

    const updatedUser = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: { coverimage: coverImage }
        },
        { new: true }).select(
            "-password -refreshToken"
        )


    return res.status(200)
        .json(new apiResponse(200, updatedUser, "User updated successfully."))

}

export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateFullname, updateAvatar, updateCoverImage }