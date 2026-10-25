import { User } from "../models/users.model"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { apiResponse } from "../utils/ApiResponse.js"

const registerUser = async (req, res) => {
    const { username, fullname, email, password } = req.body

    if ([username, fullname, email, password].some(field => !field || !field.trim)) {
        return res.status(400).json({ message: "All fields are required and cannot be empty." })
    }

    const existedUser = User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUser) {
        return res.status(409).json({
            message: "User with this email or username already exists."
        })
    }

    const avatarPath = req.files?.avatar[0]?.path
    const coverImagePath = req.files?.coverImage[0]?.path

    if (!avatarPath) {
        return res.status(400).json({ message: "Avatar file is required." })
    }

    const avatar = await uploadOnCloudinary(avatarPath)
    const coverImage = await uploadOnCloudinary(avatarPath)

    if (!avatar) {
        return res.status(400).json({ message: "Avatar file is required." })
    }

    const user = User.create({
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

export { registerUser }