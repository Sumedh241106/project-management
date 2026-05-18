import { Router, Request, Response, RequestHandler } from "express";
import { getUsers, createUser } from "../controllers/userController";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", getUsers);
router.post("/", createUser);

const getNotificationsHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
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
  } catch (error: any) {
    res.status(500).json({ message: `Error loading unread alerts: ${error.message}` });
  }
};

router.get("/:userId/notifications", getNotificationsHandler);

export default router;