-- AlterTable
ALTER TABLE "likes" ADD COLUMN     "reply_id" INTEGER;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_reply_id_fkey" FOREIGN KEY ("reply_id") REFERENCES "replies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
