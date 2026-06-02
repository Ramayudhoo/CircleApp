/*
  Warnings:

  - You are about to drop the column `created_At` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the column `created_At` on the `replies` table. All the data in the column will be lost.
  - You are about to drop the column `updated_At` on the `replies` table. All the data in the column will be lost.
  - You are about to drop the column `created_At` on the `threads` table. All the data in the column will be lost.
  - You are about to drop the column `created_By` on the `threads` table. All the data in the column will be lost.
  - You are about to drop the column `updated_At` on the `threads` table. All the data in the column will be lost.
  - You are about to drop the column `created_At` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_At` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `followers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `replies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `threads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `threads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "followers" DROP CONSTRAINT "followers_follower_id_fkey";

-- DropForeignKey
ALTER TABLE "followers" DROP CONSTRAINT "followers_following_id_fkey";

-- DropForeignKey
ALTER TABLE "threads" DROP CONSTRAINT "threads_created_By_fkey";

-- AlterTable
ALTER TABLE "likes" DROP COLUMN "created_At",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "replies" DROP COLUMN "created_At",
DROP COLUMN "updated_At",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "threads" DROP COLUMN "created_At",
DROP COLUMN "created_By",
DROP COLUMN "updated_At",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_At",
DROP COLUMN "updated_At",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "followers";

-- CreateTable
CREATE TABLE "following" (
    "id" SERIAL NOT NULL,
    "follower_id" INTEGER NOT NULL,
    "following_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "following_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "following_follower_id_following_id_key" ON "following"("follower_id", "following_id");

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "following_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "following_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threads" ADD CONSTRAINT "threads_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
