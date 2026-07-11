import { createClient } from "redis";
import { env } from "../../../config/env.service.js";

export const client = createClient({
    url: env.redisUrl,
});

export const RedisConnection = async () => {
    try {
        client.on("error", (err) => {
            console.log("Redis Client Error: ", err);
        });

        await client.connect();
        console.log("Redis Connected...");
    } catch (error) {
        console.log("Redis connection error: ", error);
    }
};
