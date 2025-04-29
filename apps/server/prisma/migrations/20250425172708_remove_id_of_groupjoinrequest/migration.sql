/*
  Warnings:

  - The primary key for the `GroupJoinRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `GroupJoinRequest` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "GroupJoinRequest_userId_groupId_key";

-- AlterTable
ALTER TABLE "GroupJoinRequest" DROP CONSTRAINT "GroupJoinRequest_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "GroupJoinRequest_pkey" PRIMARY KEY ("userId", "groupId");
