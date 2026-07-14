import fs from "fs";
import cloudinary from "../../../../config/cloudinary.config.js";

export const uploadToCloudinary = async (
    filePath,
    folderName,
    options = {},
) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
            folder: `Saraha_App/${folderName}`,
            ...options,
        });

        return uploadResult;
    } finally {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};
