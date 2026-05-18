"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get("/", userController_1.getUsers);
router.post("/", userController_1.createUser);
const getNotificationsHandler = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await prisma.notification.findMany({
            where: {
                userId: Number(userId),
                isRead: false
            },
            orderBy: {
                createdAt: "desc"
            },
        });
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ message: `Error loading unread alerts: ${error.message}` });
    }
};
router.get("/:userId/notifications", getNotificationsHandler);
exports.default = router;
