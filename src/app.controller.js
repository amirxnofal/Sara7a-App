import express from "express";
import { env } from "../config/env.service.js";
import { DatabaseConnection } from "./database/connection.js";
import { RedisConnection } from "./database/redis/redis.js";
import { GlobalErrorHandler } from "./common/utils/Error/error.handler.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/users/users.controller.js";
import messageRouter from "./modules/messages/messages.controller.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

export const bootstrap = async () => {
    const app = express();
    app.use(express.json());

    await DatabaseConnection();
    await RedisConnection();

    app.get("/check-health", (req, res) => {
        res.json({ message: "Server is healthy..." });
    });

    app.use(cors());
    app.use("/auth", authRouter);
    app.use("/users", userRouter);
    app.use("/messages", messageRouter);

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

    app.use("{*dummy}", (req, res) => {
        res.status(404).json({ message: "url not found" });
    });

    app.use(GlobalErrorHandler);

    app.listen(env.port, () => {
        console.log("Server is running...");
    });
};
