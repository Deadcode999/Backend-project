import { User } from "../models/users.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { apiResponse } from "../utils/ApiResponse.js"



const generateAccessAndRefreshToken = async (user_id) => { 
    try {
        const user = User.findOne({ _id: user_id })
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
        res.status(500).json({ message: "Something went wrong while registring user." })
    }

    return res.status(200).json(
        new apiResponse(200, createdUser, "user registered successfully")
    )

}

const loginUser = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        res.status(400).json({ message: "All feild are required." })
    }

    const user = await User.findOne({ username: username })

    if (!user) {
        res.status(401).json({ message: "Invalid username or password" })
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid username or password" })
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = User.findById(user._id).select(
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

export { registerUser, loginUser }