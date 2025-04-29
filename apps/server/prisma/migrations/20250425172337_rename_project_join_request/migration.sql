/*
  Warnings:

  - You are about to drop the `ProjectJoinRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectJoinRequest" DROP CONSTRAINT "ProjectJoinRequest_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectJoinRequest" DROP CONSTRAINT "ProjectJoinRequest_userId_fkey";

-- DropTable
DROP TABLE "ProjectJoinRequest";

-- CreateTable
CREATE TABLE "GroupJoinRequest" (
    "id" BIGSERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupJoinRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupJoinRequest_userId_projectId_key" ON "GroupJoinRequest"("userId", "projectId");

-- AddForeignKey
ALTER TABLE "GroupJoinRequest" ADD CONSTRAINT "GroupJoinRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupJoinRequest" ADD CONSTRAINT "GroupJoinRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
