import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany();

    // Fallback: If no teams are seeded yet, create an initial team dynamically
    if (teams.length === 0) {
      const defaultTeam = await prisma.team.create({
        data: {
          teamName: "Core Development Team",
          productOwnerUserId: 1,
          projectManagerUserId: 1,
        }
      });
      
      const checkUser = await prisma.user.findFirst();
      if (checkUser) {
        await prisma.user.update({
          where: { userId: checkUser.userId },
          data: { teamId: defaultTeam.id }
        });
      }

      res.json([defaultTeam]);
      return;
    }

    // Map through records to append clean username descriptions for your UI grids
    const teamsWithUsernames = await Promise.all(
      teams.map(async (team) => {
        const productOwner = await prisma.user.findUnique({
          where: { userId: team.productOwnerUserId || undefined },
        });
        const projectManager = await prisma.user.findUnique({
          where: { userId: team.projectManagerUserId || undefined },
        });
        return {
          ...team,
          productOwnerUsername: productOwner ? productOwner.username : "Unassigned",
          projectManagerUsername: projectManager ? projectManager.username : "Unassigned",
        };
      })
    );

    res.json(teamsWithUsernames);
  } catch (error: any) {
    console.error("CRITICAL DATABASE TEAM FETCH ERROR:", error);
    res.status(500).json({ message: `Error retrieving teams list: ${error.message}` });
  }
};

export const createTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamName, productOwnerUserId, projectManagerUserId } = req.body;
    const newTeam = await prisma.team.create({
      data: {
        teamName,
        productOwnerUserId: productOwnerUserId ? Number(productOwnerUserId) : null,
        projectManagerUserId: projectManagerUserId ? Number(projectManagerUserId) : null,
      },
    });
    res.status(201).json(newTeam);
  } catch (error: any) {
    console.error("Database team creation error:", error);
    res.status(500).json({ message: `Error creating team: ${error.message}` });
  }
};