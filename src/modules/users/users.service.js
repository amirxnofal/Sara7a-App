import { isValidObjectId } from "mongoose";
import { userModel } from "../../database/models/user.model.js";

import {
    CompareText,
    HashText,
} from "../../common/middleware/security/encryption.js";

import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    UnAuthorizedException,
} from "../../common/utils/Error/error.handler.js";
import { GenerateToken } from "../../common/middleware/auth/token.js";
import { env } from "../../../config/env.service.js";

//*------------ Get my profile ------------
export const retriveProfile = async (userId) => {
    const isExist = await userModel.findById(userId);
    if (!isExist || isExist.status === "deleted")
        NotFoundException({ message: "user not found" });
    if (isExist.status === "inactive")
        ForbiddenException({ message: "Account is inactive" });

    return isExist;
};

//*------------ Update profile ------------
export const updateProfile = async (data, userId, file) => {
    let { username, email, password, newPassword, phone } = data;

    const isExist = await userModel.findById(userId);
    if (!isExist || isExist.status === "deleted")
        NotFoundException({ message: "user not found" });

    if (email || newPassword) {
        console.log("Email: ", email);
        console.log("newPassword: ", newPassword);
        console.log("Password: ", password);
        let comparedPassword = await CompareText(password, isExist.password);
        console.log("Compare result: ", comparedPassword);
        if (!comparedPassword)
            UnAuthorizedException({ message: "Wrong password!" });

        if (newPassword) isExist.password = await HashText(newPassword);

        if (email && email !== isExist.email) {
            const isEmailExist = await userModel.findOne({ email });
            console.log(isEmailExist);
            if (isEmailExist)
                ConflictException({ message: "email already exist" });
            isExist.email = email;
            isExist.isVerified = false;

            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const otp = await HashText(code);
            const isSent = await sendEmail({
                to: email,
                subject: "Your OTP Code",
                html: `
                    <!DOCTYPE html>
                    <html>
                    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                        <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 10px; padding: 30px; text-align: center;">
                            <h1 style="color: #4F46E5;">Sara7a App 💬</h1>
                            <p style="color: #555; font-size: 16px;">Your OTP Code is:</p>
                            <h2 style="letter-spacing: 10px; font-size: 36px; color: #4F46E5;">${code}</h2>
                            <p style="color: #aaa; font-size: 12px;">This code expires in 10 minutes.</p>
                            <p style="color: #aaa; font-size: 12px;">If you didn't request this, ignore this email.</p>
                        </div>
                    </body>
                    </html>
                `,
            });

            if (!isSent) BadRequestException({ message: "Failed to send OTP" });
            isExist.otp = code;
        }
    }

    if (username) isExist.username = username;

    if (phone && phone !== isExist.phone) {
        const phoneExist = await userModel.findOne({ phone });
        if (phoneExist) ConflictException({ message: "phone already exist" });
        isExist.phone = phone;
    }
    if (file) {
        isExist.profileImage = `${env.serverUrl}/${file.path}`;
    }
    await isExist.save();
    return isExist;
};

//*------------ Activate profile ------------
export const activeProfile = async (userId, password) => {
    const isExist = await userModel.findById(userId);
    if (!isExist || isExist.status === "deleted")
        NotFoundException({ message: "user not found" });

    let comparedPassword = await CompareText(password, isExist.password);
    if (!comparedPassword)
        UnAuthorizedException({ message: "Wrong password!" });

    if (isExist.status === "active")
        ConflictException({ message: "Account already active" });

    isExist.status = "active";
    await isExist.save();
    return isExist;
};

//*------------ Inactivate profile ------------
export const inactiveProfile = async (userId, password) => {
    const isExist = await userModel.findById(userId);
    if (!isExist || isExist.status === "deleted")
        NotFoundException({ message: "user not found" });

    let comparedPassword = await CompareText(password, isExist.password);
    if (!comparedPassword)
        UnAuthorizedException({ message: "Wrong password!" });

    if (isExist.status === "inactive")
        ConflictException({ message: "Account already inactive" });

    isExist.status = "inactive";
    await isExist.save();
    return isExist;
};

//*------------ Delete profile ------------
export const deleteProfile = async (userId, password) => {
    const isExist = await userModel.findById(userId);
    if (!isExist || isExist.status === "deleted")
        NotFoundException({ message: "user not found" });

    let comparedPassword = await CompareText(password, isExist.password);
    if (!comparedPassword)
        UnAuthorizedException({ message: "Wrong password!" });

    isExist.status = "deleted";
    await isExist.save();
    return isExist;
};
