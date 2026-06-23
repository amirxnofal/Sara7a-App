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
    const upload = multer({ storage: storage });
    return upload;
};
