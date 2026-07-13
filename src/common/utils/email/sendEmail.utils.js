import nodemailer from "nodemailer";
import { env } from "../../../../config/env.service.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.googleAppEmail,
        pass: env.googleAppPassword,
    },
});

export const sendEmail = async ({ to, subject, html }) => {
    const info = await transporter.sendMail({
        from: `Amir Mohamed ${env.googleAppEmail} `,
        to,
        subject,
        html,
    });
    console.log("Mail sent <3");
    return info;
};
