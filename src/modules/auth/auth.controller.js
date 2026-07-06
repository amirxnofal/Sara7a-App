import { Router } from "express";
import { SuccessResponse } from "../../common/utils/Responses/success.response.js";
import {
    emailLogin,
    getAccessToken,
    googelLogin,
    logout,
    register,
    verifyEmail,
} from "./auth.service.js";
import { Validation } from "../../common/middleware/validation/validation.middleware.js";
import {
    loginSchema,
    registerSchema,
    verifyEmailSchema,
} from "./auth.validation.js";
import { Auth } from "../../common/middleware/auth/auth.middleware.js";

const router = Router();

//*------------ Register ------------
router.post("/register", Validation(registerSchema), async (req, res, next) => {
    try {
        const result = await register(req.body);
        SuccessResponse({
            res,
            message: "Register success",
            data: result,
            status: 201,
        });
    } catch (error) {
        next(error);
    }
});

//*------------ Login with email ------------
router.post("/login", Validation(loginSchema), async (req, res, next) => {
    try {
        const result = await emailLogin(req.body, req.get("host"));
        SuccessResponse({
            res,
            message: "Login success",
            token: result.token,
            status: 200,
        });
    } catch (error) {
        next(error);
    }
});

//*------------ Get Access Token ------------
router.get("/token", async (req, res, next) => {
    try {
        const result = await getAccessToken(
            req.headers.authorization,
            req.get("host"),
        );
        SuccessResponse({
            res,
            message: "Access token",
            token: result,
            status: 201,
        });
    } catch (error) {
        next(error);
    }
});

//*------------ Verify email ------------
router.post(
    "/verify",
    Validation(verifyEmailSchema),
    async (req, res, next) => {
        try {
            const result = await verifyEmail(req.body);
            SuccessResponse({
                res,
                message: "Email verified",
                data: result,
                status: 200,
            });
        } catch (error) {
            next(error);
        }
    },
);

//*------------ Login with Google ------------
router.post("/google-login", async (req, res, next) => {
    try {
        const result = await googelLogin(req.body, req.get("host"));
        SuccessResponse({
            res,
            message: "Login success",
            data: { access_token: result.token },
            status: 200,
        });
    } catch (error) {
        next(error);
    }
});

//*------------ Logout ------------
router.post("/logout", Auth, async (req, res, next) => {
    try {
        const result = await logout(req);
        SuccessResponse({
            res,
            message: "Logout success",
            data: result,
            status: 200,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
