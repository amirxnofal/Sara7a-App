import { isValidObjectId } from "mongoose";
import { messageModel } from "../../database/models/message.model.js";
import { userModel } from "../../database/models/user.model.js";
import {
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from "../../common/utils/Error/error.handler.js";
import { env } from "../../../config/env.service.js";

//*------------ Send anonymous message ------------
export const sendMessage = async (receiverId, content, file) => {
    if (!isValidObjectId(receiverId))
        BadRequestException({ message: "Invalid user id" });

    if (!content && !file)
        BadRequestException({
            message: "Message must have text content or an image",
        });

    const receiver = await userModel.findById(receiverId);
    if (!receiver || receiver.status === "deleted")
        NotFoundException({ message: "User not found" });

    if (receiver.status === "inactive")
        ForbiddenException({ message: "This user is not accepting messages" });

    const message = await messageModel.insertOne({
        content,
        receiverId,
        image: file ? `${env.serverUrl}/${file.path}` : undefined,
    });
    
    if (!message)
        BadRequestException({
            message: "Somthing went wrong",
        });
    
    return message;
};

//*------------ Get my messages (paginated) ------------
export const getMyMessages = async (userId, { page, limit } = {}) => {
    page = Math.max(Number(page) || 1, 1);
    limit = Math.min(Math.max(Number(limit) || 10, 1), 50);

    const [messages, count] = await Promise.all([
        messageModel
            .find({ receiverId: userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
        messageModel.countDocuments({ receiverId: userId }),
    ]);

    return {
        messages,
        count,
        page,
        pages: Math.ceil(count / limit) || 1,
    };
};

//*------------ Get a single message (owner only) ------------
export const getMessage = async (userId, messageId) => {
    if (!isValidObjectId(messageId))
        BadRequestException({ message: "Invalid message id" });

    const message = await messageModel.findById(messageId);
    if (!message) NotFoundException({ message: "Message not found" });

    if (message.receiverId.toString() !== userId.toString())
        ForbiddenException({ message: "Not allowed to view this message" });

    return message;
};

//*------------ Delete a message (owner only) ------------
export const deleteMessage = async (userId, messageId) => {
    if (!isValidObjectId(messageId))
        BadRequestException({ message: "Invalid message id" });

    const message = await messageModel.findById(messageId);
    if (!message) NotFoundException({ message: "Message not found" });

    if (message.receiverId.toString() !== userId.toString())
        ForbiddenException({ message: "Not allowed to delete this message" });

    await message.deleteOne();
    return { deleted: true };
};
