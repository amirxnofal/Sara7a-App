import jwt from "jsonwebtoken";
import { env } from "../../../../config/env.service.js";
import { UnAuthorizedException } from "../../utils/Error/error.handler.js";
import * as redis from "../../../database/redis/redis.serviec.js";

export const GenerateToken = (payload, host, role) => {
    const accessToken = jwt.sign({ _id: payload._id, role }, env.secretKey, {
        expiresIn: "30m",
        issuer: host,
    });
    const refreshToken = jwt.sign(
        { _id: payload._id, role },
        env.refreshSecretKey,
        { expiresIn: "1y", issuer: host },
    );
    return { accessToken, refreshToken };
};

export const generateAccessToken = async(refreshToken, host) => {
    if (!refreshToken || !refreshToken.startsWith("Bearer "))
        return UnAuthorizedException({ message: "Unauthorized" });

    const token = refreshToken.split(" ")[1];
    try {
        const decoded = jwt.verify(token, env.refreshSecretKey);

        const redisKey = await redis.createRevokeToken({
            userId: decoded._id,
            token,
        });
        const isRevoked = await redis.exists(redisKey);
        if (isRevoked)
            return UnAuthorizedException({
                message: "Refresh token revoked, please login again",
            });

        const accessToken = jwt.sign(
            { _id: decoded._id, role: decoded.role },
            env.secretKey, 
            { expiresIn: "30m", issuer: host },
        );

        return accessToken;
    } catch (err) {
        UnAuthorizedException({ message: err.message });
    }
};
