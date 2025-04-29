/*
  Warnings:

  - You are about to drop the column `projectId` on the `GroupJoinRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,groupId]` on the table `GroupJoinRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `groupId` to the `GroupJoinRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GroupJoinRequest" DROP CONSTRAINT "GroupJoinRequest_projectId_fkey";

-- DropIndex
DROP INDEX "GroupJoinRequest_userId_projectId_key";

-- AlterTable
ALTER TABLE "GroupJoinRequest" DROP COLUMN "projectId",
ADD COLUMN     "groupId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GroupJoinRequest_userId_groupId_key" ON "GroupJoinRequest"("userId", "groupId");

-- AddForeignKey
ALTER TABLE "GroupJoinRequest" ADD CONSTRAINT "GroupJoinRequest_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
