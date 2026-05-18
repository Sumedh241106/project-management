"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerNotification = void 0;
const client_1 = require("@prisma/client");
const nodemailer_1 = __importDefault(require("nodemailer"));
const prisma = new client_1.PrismaClient();
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: process.env.EMAIL_USER || "mock-user@ethereal.email",
        pass: process.env.EMAIL_PASS || "mock-password",
    },
});
const triggerNotification = async (io, userId, message) => {
    try {
        // Fixed: Added explicit fallback definitions for relational integrity fields
        const notification = await prisma.notification.create({
            data: {
                userId: Number(userId),
                message: message,
                isRead: false
            },
        });
        if (io) {
            io.emit(`notification_user_${userId}`, notification);
        }
        const targetUser = await prisma.user.findUnique({ where: { userId: Number(userId) } });
        if (targetUser && targetUser.email) {
            const mailOptions = {
                from: '"Nexus Workspace" <alerts@nexus-pm.com>',
                to: targetUser.email,
                subject: "⚠️ Critical Workspace Update Assigned to You",
                html: `
          <div style="font-family: sans-serif; padding: 20px; background: #f9f9f9; color: #333;">
            <h2 style="color: #2563eb;">Nexus Project Operations</h2>
            <p>Hello <b>${targetUser.username}</b>,</p>
            <p style="background: #fff; padding: 15px; border-left: 4px solid #2563eb; border-radius: 4px;">
              ${message}
            </p>
            <p style="font-size: 11px; color: #999; margin-top: 20px;">
              This is an automated operational pipeline notification. Log into your dashboard workspace to view tracking cards.
            </p>
          </div>
        `,
            };
            transporter.sendMail(mailOptions, (err, info) => {
                if (err)
                    console.error("Email engine delivery error:", err);
                else
                    console.log(`Notification mail sent safely: ${info.messageId}`);
            });
        }
    }
    catch (error) {
        console.error("Failed to execute notification trigger sequences:", error?.message || error);
    }
};
exports.triggerNotification = triggerNotification;
