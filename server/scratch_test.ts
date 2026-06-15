import prisma from "./src/lib/prisma";

async function main() {
  try {
    console.log("Querying replies for thread ID 9...");
    const replies = await prisma.replies.findMany({
      where: { thread_id: 9 },
      take: 25,
      orderBy: { created_at: "asc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            full_name: true,
            photo_profile: true,
          },
        },
        likes: true,
      },
    });
    console.log("Success! Replies count:", replies.length);
  } catch (error) {
    console.error("Prisma query error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
