import { isValidObjectId } from "mongoose";
import { userModel } from "../../database/models/user.model.js";
import joi from "joi";
import {
    generateAccessToken,
    GenerateToken,
} from "../../common/middleware/auth/token.js";
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
import { registerSchema } from "./auth.validation.js";
import { sendEmail } from "../../common/utils/sendEmail.utils.js";
import { OAuth2Client } from "google-auth-library";
import { env } from "../../../config/env.service.js";

//*------------ Register ------------
export const register = async (data) => {
    let { username, email, password, phone } = data;

    const userExist = await userModel.findOne({ email });
    if (userExist) ConflictException({ message: "email already exist" });

    const phoneExist = await userModel.findOne({ phone });
    if (phoneExist) ConflictException({ message: "phone already exist" });

    const hashedPassword = await HashText(password);

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

    return await userModel.create({
        username,
        email,
        password: hashedPassword,
        phone,
        otp,
    });
};

//*------------ Login ------------
export const emailLogin = async (data, host) => {
    if (!data) return BadRequestException({ message: "Fill all fields." });

    const { email, password } = data;
    if (!email || !password)
        BadRequestException({ message: "Must fill email and password" });

    const userExist = await userModel.findOne({ email });
    if (!userExist || userExist.status === "deleted")
        NotFoundException({ message: "User not found" });

    if (userExist.status === "inactive")
        ForbiddenException({ message: "Account is inactive" });

    const isPassword = await CompareText(password, userExist.password);
    if (!isPassword) BadRequestException({ message: "incorrect password" });

    if (userExist.isVerified === false)
        UnAuthorizedException({ message: "Email is not verified" });

    const token = GenerateToken({ _id: userExist._id }, host, userExist.role);
    return { token };
};

//*------------ Get access token ------------
export const getAccessToken = async (authorization, host) => {
    const token = await generateAccessToken(authorization, host);
    return token;
};

//*------------ Verify email ------------
export const verifyEmail = async (data) => {
    let { otp, email } = data;

    const isExist = await userModel.findOne({ email });
    if (!isExist || isExist.status === "deleted")
        NotFoundException({ message: "User not found" });

    const isOTP = await CompareText(otp, isExist.otp);
    if (!isOTP) BadRequestException({ message: "Wrong OTP Code" });

    isExist.isVerified = true;
    isExist.status = "active";
    isExist.otp = null;
    await isExist.save();
    return isExist;
};

//*------------ Login with Google ------------
export const googelLogin = async (data, host) => {
    const { idToken } = data;
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken,
        audience: env.googleClientId,
    });
    const payload = ticket.getPayload();


    let isExist = await userModel.findOne({ email: payload.email });
    if (!isExist)
        isExist =await userModel.create({
            username: payload.given_name,
            email: payload.email,
            isVerified: payload.email_verified,
            profileImage: payload.picture,
            status: "active",
            authProvider: "google",
        });

    const token = await GenerateToken({ _id: isExist._id }, host, isExist.role);

    return { token };
};
