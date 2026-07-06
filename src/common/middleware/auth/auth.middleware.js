import jwt from "jsonwebtoken";
import { env } from "../../../../config/env.service.js";
import { UnAuthorizedException } from "../../utils/Error/error.handler.js";
import * as redis from "../../../database/redis/redis.serviec.js";

export const Auth = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer "))
        UnAuthorizedException({ message: "Unauthorized" });

    const token = authorization.split(" ")[1];

    try {
        const decoded = jwt.verify(token, env.secretKey);

        const redisKey = await redis.createRevokeToken({
            userId: decoded._id,
            token,
        });
        const isRevoked = await redis.exists(redisKey);
        if (isRevoked)
            return UnAuthorizedException({
                message: "Token revoked, please login again",
            });

        req.user = decoded;
        req.token = token;
        next();
    } catch (err) {
        UnAuthorizedException({ message: err.message });
    }
};
