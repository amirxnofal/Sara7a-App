import { env } from "../../../../config/env.service.js";

const ErrorResponse = ({
    status = 500,
    message = "Something went wrong!",
    extra,
} = {}) => {
    throw new Error(message, { cause: { status, extra } });
};


//! Not found
export const NotFoundException = ({ message = "Not found", extra } = {}) =>
    ErrorResponse({ status: 404, message, extra });

//! Bad request
export const BadRequestException = ({ message = "Bad request", extra } = {}) =>
    ErrorResponse({ status: 400, message, extra });

//! Conflict
export const ConflictException = ({ message = "Conflict", extra } = {}) =>
    ErrorResponse({ status: 409, message, extra });

//! Forbidden
export const ForbiddenException = ({ message = "Forbidden", extra } = {}) =>
    ErrorResponse({ status: 403, message, extra });

//! UnAuthorized
export const UnAuthorizedException = ({
    message = "Unauthorized",
    extra,
} = {}) => ErrorResponse({ status: 401, message, extra });


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
