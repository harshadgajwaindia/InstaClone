/*
  Warnings:

  - A unique constraint covering the columns `[followerId,followingId]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");
