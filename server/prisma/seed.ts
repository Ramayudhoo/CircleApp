import prisma from "../src/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  // hapus data lama dulu
  await prisma.likes.deleteMany();
  await prisma.replies.deleteMany();
  await prisma.threads.deleteMany();
  await prisma.users.deleteMany();

  // buat users
  const user1 = await prisma.users.create({
    data: {
      username: "Ramayudho",
      full_name: "Rama Cahaya Yudhoyono",
      email: "Yudho@gmail.com",
      password: await bcrypt.hash("rama123", 10),
      bio: "Frontend Developer",
    },
  });

  const user2 = await prisma.users.create({
    data: {
      username: "joko_wiharyo",
      full_name: "Joko wiharyo",
      email: "joko_wiharyo@example.com",
      password: await bcrypt.hash("joko123", 10),
      bio: "Backend Developer",
    },
  });

  // buat threads
  const thread1 = await prisma.threads.create({
    data: {
      content: "Baru aja deploy project baru, semoga lancar ya! 🚀",
      created_by: user1.id,
    },
  });

  const thread2 = await prisma.threads.create({
    data: {
      content: "Kapan ya dapet kerjaan yang beneran sesuai passion? 😅",
      created_by: user2.id,
    },
  });

  const thread3 = await prisma.threads.create({
    data: {
      content: "Kapan ya bisa liburan bareng Kuarga kerja mulu nih!",
      created_by: user1.id,
    },
  });

  // buat likes
  await prisma.likes.create({
    data: { user_id: user2.id, thread_id: thread1.id },
  });

  await prisma.likes.create({
    data: { user_id: user1.id, thread_id: thread2.id },
  });

  console.log("✅ Seed berhasil!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
