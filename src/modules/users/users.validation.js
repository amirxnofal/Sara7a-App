import joi from "joi";

export const updateUserSchema = joi.object({
    username: joi
        .string()
        .min(3)
        .max(30)
        .optional()
        .pattern(/^[a-zA-Z]+$/),
    email: joi.string().email().optional(),

    password: joi
        .string()
        .min(8)
        .optional()
        .pattern(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        )
        .when("newPassword", { is: joi.exist(), then: joi.required() })
        .when("email", { is: joi.exist(), then: joi.required() }),

    newPassword: joi
        .string()
        .min(8)
        .optional()
        .pattern(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        ),
});

export const updateStatusSchema = joi.object({
    password: joi
        .string()
        .min(8)
        .optional()
        .required()
        .pattern(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        ),
});
