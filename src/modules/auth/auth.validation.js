import joi from "joi";

export const registerSchema = joi.object({
    username: joi
        .string()
        .min(3)
        .max(30)
        .required()
        .pattern(/^[a-zA-Z]+$/),
    email: joi.string().email().required(),
    password: joi
        .string()
        .min(8)
        .required()
        .pattern(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        ),
});

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi
        .string()
        .min(8)
        .required()
        .pattern(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        ),
});

export const verifyEmailSchema = joi.object({
    email: joi.string().email().required(),
    otp: joi.string().required().length(6),
});
