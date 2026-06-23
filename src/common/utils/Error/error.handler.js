import { env } from "../../../../config/env.service.js";

const ErrorResponse = ({
    status = 500,
    message = "Something went wrong!",
    extra,
} = {}) => {
    throw new Error(message, { cause: { status, extra } });
};

export const GlobalErrorHandler = (err, req, res, next) => {
    const isDev = env.mood === "dev";
    const message = err.message ?? "Something went wrong!";
    const status = err.status ?? err.cause?.status ?? 500;
    const extra = err.cause?.extra;

    res.status(status).json({
        success: false,
        message: isDev ? message : "Something went wrong!",
        ...(isDev && { stack: err.stack }),
        ...(isDev && extra && { extra }),
    });
};
