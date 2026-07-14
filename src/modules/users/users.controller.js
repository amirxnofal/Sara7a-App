import { Router } from "express";
import { SuccessResponse } from "../../common/utils/Responses/success.response.js";
import { Auth } from "../../common/middleware/auth/auth.middleware.js";
import {
    activeProfile,
    deleteProfile,
    inactiveProfile,
    retriveProfile,
    retriveUserDataByUsername,
    updateProfile,
} from "./users.service.js";
import { Validation } from "../../common/middleware/validation/validation.middleware.js";
import { updateStatusSchema, updateUserSchema } from "./users.validation.js";
import { upload } from "../../common/middleware/uploads/multer.middleware.js";

const router = Router();

//*------------ Get Profile ------------
router.get("/profile", Auth, async (req, res, next) => {
    try {
        const result = await retriveProfile(req.user._id);
        SuccessResponse({
            res,
            message: "My profile",
            data: result,
            status: 200,
        });
    } catch (error) {
        next(error);
    }
});

//*------------ Get User Data By Username ------------
router.get("/get-data-by-username/:username", Auth, async (req, res, next) => {
    try {
        const result = await retriveUserDataByUsername(req.params.username);
        SuccessResponse({
            res,
            message: "My profile",
            data: result,
            status: 200,
        });
    } catch (error) {
        next(error);
    }
});

//*------------ Update Profile ------------
router.put(
    "/profile",
    Auth,
    Validation(updateUserSchema),
    upload.single("profileImage"),
    async (req, res, next) => {
        try {
            const result = await updateProfile(
                req.body,
                req.user._id,
                req.file,
            );
            SuccessResponse({
                res,
                message: "Profile updated",
                data: result,
                status: 200,
            });
        } catch (error) {
            next(error);
        }
    },
);

//*------------ Active Profile ------------
router.put(
    "/profile/active",
    Auth,
    Validation(updateStatusSchema),
    async (req, res, next) => {
        try {
            const result = await activeProfile(req.user._id, req.body.password);
            SuccessResponse({
                res,
                message: "Profile activated",
                data: result,
                status: 200,
            });
        } catch (error) {
            next(error);
        }
    },
);

//*------------ InActive Profile ------------
router.put(
    "/profile/inactive",
    Auth,
    Validation(updateStatusSchema),
    async (req, res, next) => {
        try {
            const result = await inactiveProfile(
                req.user._id,
                req.body.password,
            );
            SuccessResponse({
                res,
                message: "Profile inactive",
                data: result,
                status: 200,
            });
        } catch (error) {
            next(error);
        }
    },
);

//*------------ Delete Profile ------------
router.put(
    "/profile/delete",
    Auth,
    Validation(updateStatusSchema),
    async (req, res, next) => {
        try {
            const result = await deleteProfile(req.user._id, req.body.password);
            SuccessResponse({
                res,
                message: "Profile deleted",
                data: result,
                status: 200,
            });
        } catch (error) {
            next(error);
        }
    },
);

export default router;
