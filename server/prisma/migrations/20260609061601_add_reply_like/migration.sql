/*
  Warnings:

  - A unique constraint covering the columns `[user_id,reply_id]` on the table `likes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "likes" ALTER COLUMN "thread_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_reply_id_key" ON "likes"("user_id", "reply_id");
