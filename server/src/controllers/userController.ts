import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    
    // Fallback: If no users exist in the database yet, seed the current authenticated user dynamically
    if (users.length === 0) {
      const fallbackUser = await prisma.user.create({
        data: {
          cognitoId: "system-init",
          username: "Sumedh (Admin)",
          email: "admin@nexus.com",
          profilePictureUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
        },
      });
      res.json([fallbackUser]);
      return;
    }

    res.json(users);
  } catch (error: any) {
    console.error("CRITICAL DATABASE USER FETCH ERROR:", error);
    res.status(500).json({ message: `Error retrieving users list: ${error.message}` });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, cognitoId, profilePictureUrl, teamId } = req.body;
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        cognitoId,
        profilePictureUrl: profilePictureUrl || "i1.png",
        teamId: teamId ? Number(teamId) : null,
      },
    });
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error("Database user insertion crash:", error);
    res.status(500).json({ message: `Error creating user node: ${error.message}` });
  }
};