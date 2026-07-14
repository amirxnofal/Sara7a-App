import { Router } from "express";
import { SuccessResponse } from "../../common/utils/Responses/success.response.js";
import { Auth } from "../../common/middleware/auth/auth.middleware.js";
import { Validation } from "../../common/middleware/validation/validation.middleware.js";
import { upload } from "../../common/middleware/uploads/multer.middleware.js";
import { sendMessageSchema } from "./messages.validation.js";
import {
    deleteMessage,
    getMessage,
    getMyMessages,
    sendMessage,
} from "./messages.service.js";

const router = Router();

//*------------ Send an anonymous message to a user ------------
router.post(
    "/:receiverId",
    Validation(sendMessageSchema),
    upload.array("attachment",3),
    async (req, res, next) => {
        try {
            const result = await sendMessage(
                req.params.receiverId,
                req.body.content,
                req.files,
            );
            SuccessResponse({
                res,
                message: "Message sent",
                data: result,
                status: 201,
            });
        } catch (error) {
            next(error);
        }
    },
);

//*------------ Get my inbox (paginated) ------------
router.get("/", Auth, async (req, res, next) => {
    try {
        const result = await getMyMessages(req.user._id, req.query);
        SuccessResponse({
            res,
            message: "My messages",
            data: result,
            status: 200,
        });
    } catch (error) {
        next(error);
    }
});

//*------------ Get a single message ------------
router.get("/:messageId", Auth, async (req, res, next) => {
    try {
        const result = await getMessage(req.user._id, req.params.messageId);
        SuccessResponse({
            res,
            message: "Message",
            data: result,
            status: 200,
        });
    } catch (error) {
        next(error);
    }
});

//*------------ Delete a message ------------
router.delete("/:messageId", Auth, async (req, res, next) => {
    try {
        const result = await deleteMessage(req.user._id, req.params.messageId);
        SuccessResponse({
            res,
            message: "Message deleted",
            data: result,
            status: 200,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
