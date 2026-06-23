import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            maxLength: 50,
            minLength: 3,
            required: true,
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
        },
        authProvider: {
            type: String,
            enum: ["local", "google"],
            default: "local",
        },
        password: {
            type: String,
            required: function () {
                return this.authProvider === "local";
            },
        },
        phone: {
            type: String,
            unique: true,
        },
        role: {
            // ["user: 0","admin :1"],
            type: Number,
            enum: [0, 1],
            default: 0,
        },
        profileImage: {
            type: String,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "deleted"],
            default: "inactive",
        },
    },
    { timestamps: true },
);

userSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password;
        delete ret.otp;
        delete ret.__v;
        return ret;
    },
});

export const userModel = mongoose.model("User", userSchema);
