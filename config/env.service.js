import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

export const env = {
    port: process.env.PORT,
    mongooseUrl: process.env.MONGOOSE_URL,
    saltRounds: Number(process.env.SALT_ROUNDS),
    mood: process.env.MOOD,

    // userSignature: process.env.USER_SIGNATURE,
    // adminSignature: process.env.ADMIN_SIGNATURE,
    secretKey: process.env.SECRET_KEY,
    refreshSecretKey: process.env.REFRESH_SECRET_KEY,

    // userRefreshTokenSignature: process.env.USER_REFRESH_TOKEN,
    // adminRefreshTokenSignature: process.env.ADMIN_REFRESH_TOKEN,

    serverUrl: process.env.SERVER_URI,

    googleAppEmail: process.env.GOOGLE_APP_EMAIL,
    googleAppPassword: process.env.GOOGLE_APP_PASSWORD,

    googleClientId: process.env.GOOGLE_CLIENT_ID,
};
