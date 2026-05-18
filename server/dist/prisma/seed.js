"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    // 1. Clear existing data in the correct order (children first)
    await prisma.comment.deleteMany();
    await prisma.attachment.deleteMany();
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    await prisma.team.deleteMany();
    // 2. Create a Seed User
    const user1 = await prisma.user.create({
        data: {
            userId: 1,
            username: "admin",
            email: "admin@test.com",
            profilePictureUrl: "p1.jpeg",
            cognitoId: "admin-id",
            teamId: 1,
        },
    });
    // 3. Create a Seed Project
    const project1 = await prisma.project.create({
        data: {
            name: "Project Management App",
            description: "Default workspace project",
        },
    });
    // 4. Create a Seed Task
    await prisma.task.create({
        data: {
            title: "Complete Setup",
            description: "Initial task to verify the board works",
            status: "To Do",
            priority: "Medium",
            projectId: project1.id,
            authorUserId: user1.userId,
        },
    });
    console.log("Seeding finished successfully.");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
