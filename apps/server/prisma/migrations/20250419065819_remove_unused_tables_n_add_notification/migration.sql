/*
  Warnings:

  - You are about to drop the `I18nRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `I18nRecordData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `I18nRecordDiscussions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectChatMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectVersion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectVersionRecords` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "I18nRecord" DROP CONSTRAINT "I18nRecord_projectId_fkey";

-- DropForeignKey
ALTER TABLE "I18nRecordData" DROP CONSTRAINT "I18nRecordData_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "I18nRecordData" DROP CONSTRAINT "I18nRecordData_recordId_fkey";

-- DropForeignKey
ALTER TABLE "I18nRecordDiscussions" DROP CONSTRAINT "I18nRecordDiscussions_posterId_fkey";

-- DropForeignKey
ALTER TABLE "I18nRecordDiscussions" DROP CONSTRAINT "I18nRecordDiscussions_recordId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectChatMessage" DROP CONSTRAINT "ProjectChatMessage_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectChatMessage" DROP CONSTRAINT "ProjectChatMessage_senderId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectVersion" DROP CONSTRAINT "ProjectVersion_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectVersionRecords" DROP CONSTRAINT "ProjectVersionRecords_recordId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectVersionRecords" DROP CONSTRAINT "ProjectVersionRecords_versionId_fkey";

-- DropTable
DROP TABLE "I18nRecord";

-- DropTable
DROP TABLE "I18nRecordData";

-- DropTable
DROP TABLE "I18nRecordDiscussions";

-- DropTable
DROP TABLE "ProjectChatMessage";

-- DropTable
DROP TABLE "ProjectVersion";

-- DropTable
DROP TABLE "ProjectVersionRecords";

-- CreateTable
CREATE TABLE "UserRecentProject" (
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRecentProject_pkey" PRIMARY KEY ("userId","projectId")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserRecentProject" ADD CONSTRAINT "UserRecentProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecentProject" ADD CONSTRAINT "UserRecentProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
