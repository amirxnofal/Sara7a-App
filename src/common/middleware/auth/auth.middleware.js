import jwt from "jsonwebtoken";
import { env } from "../../../../config/env.service.js";
import { UnAuthorizedException } from "../../utils/Error/error.handler.js";

export const Auth = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer "))
        UnAuthorizedException({ message: "Unauthorized" });

    const token = authorization.split(" ")[1];

    try {
        req.user = jwt.verify(token, env.secretKey);
        next();
    } catch (err) {
        UnAuthorizedException({ message: err.message });
    }
};
