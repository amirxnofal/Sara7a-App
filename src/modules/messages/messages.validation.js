import joi from "joi";


export const sendMessageSchema = joi.object({
    content: joi.string().trim().min(1).max(500).optional(),
});
