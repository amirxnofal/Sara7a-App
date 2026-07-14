import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 3,
    message: { message: "Too many login attempts, please try again later" },
});
