import multer from "multer";

import fs from "fs";

export const upload = (file) => {
    const uploadPath = "uploads";

    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./uploads");
        },
        filename: function (req, file, cb) {
            const uniqueSuffix =
                Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
        },
    });

    const fileFilter = (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only image files are allowed"));
        }
        cb(null, true);
    };

    const upload = multer({
        storage,
        fileFilter,
        limits: { fileSize: 5 * 1024 * 1024 }, //! 5MB max
    });
    return upload;
};
