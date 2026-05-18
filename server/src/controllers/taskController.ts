import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: Number(projectId),
      },
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
      },
    });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving database tasks: ${error.message}` });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  const { 
    title, 
    description, 
    status, 
    priority, 
    tags, 
    startDate, 
    dueDate, 
    projectId, 
    assignedUserId 
  } = req.body;

  try {
    let targetAuthorId = 1;
    const existingUser = await prisma.user.findFirst();

    if (existingUser) {
      targetAuthorId = existingUser.userId;
    } else {
      const systemUser = await prisma.user.create({
        data: {
          cognitoId: "system-master-root-id",
          username: "Sumedh",
          email: "sumedh@example.com",
          profilePictureUrl: null,
        }
      });
      targetAuthorId = systemUser.userId;
    }

    let functionalAssigneeId: number | null = null;
    if (assignedUserId) {
      const validAssignee = await prisma.user.findUnique({
        where: { userId: Number(assignedUserId) }
      });
      if (validAssignee) {
        functionalAssigneeId = validAssignee.userId;
      }
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: Number(projectId),
        authorUserId: targetAuthorId,
        assignedUserId: functionalAssigneeId,
      },
    });

    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(400).json({ message: `Database relational failure: ${error.message}` });
  }
};

export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        status: status,
      },
    });
    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating task status: ${error.message}` });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;
  try {
    await prisma.task.delete({
      where: {
        id: Number(taskId),
      },
    });
    res.json({ success: true, id: Number(taskId) });
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting task from index: ${error.message}` });
  }
};