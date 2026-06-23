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
        let comparedPassword = await CompareText(password, isExist.password);
        if (!comparedPassword)
            UnAuthorizedException({ message: "Wrong password!" });

        if (newPassword) isExist.password = await HashText(newPassword);

        if (email && email !== isExist.email) {
            const isEmailExist = await userModel.findOne({ email });
            if (isEmailExist)
                ConflictException({ message: "email already exist" });
            isEmailExist.email = email;
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
