import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const searchAll = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;
  try {
    const searchString = String(query || "");

    if (!searchString.trim()) {
      res.json({ projects: [], tasks: [], users: [] });
      return;
    }

    // Execute parallel lookups across the core tables using case-insensitive contains filters
    const [projects, tasks, users] = await Promise.all([
      prisma.project.findMany({
        where: {
          OR: [
            { name: { contains: searchString, mode: "insensitive" } },
            { description: { contains: searchString, mode: "insensitive" } },
          ],
        },
      }),
      prisma.task.findMany({
        where: {
          OR: [
            { title: { contains: searchString, mode: "insensitive" } },
            { description: { contains: searchString, mode: "insensitive" } },
          ],
        },
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: searchString, mode: "insensitive" } },
            { email: { contains: searchString, mode: "insensitive" } },
          ],
        },
        take: 10,
      }),
    ]);

    res.json({ projects, tasks, users });
  } catch (error: any) {
    console.error("CRITICAL SEARCH ENGINE FAILURE:", error);
    res.status(500).json({ message: `Error performing global directory search: ${error.message}` });
  }
};