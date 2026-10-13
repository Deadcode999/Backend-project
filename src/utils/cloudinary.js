import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

const uploadOnCloudinary = async (localFilePath) => {

    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });

    try {
        if (!localFilePath) return null;

        const response = cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        console.log(`file successfuly uploaded at cloudinary : ${response}`)
        fs.unlinkSync(localFilePath)
        return response

    } catch (error) {
        console.log(`file not upload in cloudinary : ${error}`)
        fs.unlinkSync(localFilePath)
    }

}

export {uploadOnCloudinary} 