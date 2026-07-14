import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            maxLength: 500,
        },
        receiverId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        images: [
            {
                secure_url: {
                    type: String,
                    default: null,
                },
                public_id: {
                    type: String,
                    default: null,
                },
            },
        ],
    },
    { timestamps: true },
);

export const messageModel = mongoose.model("Message", messageSchema);
