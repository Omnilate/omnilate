-- CreateEnum
CREATE TYPE "GroupRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'OBSERVER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "UserKnownLanguage" (
    "id" BIGSERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "mastery" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserKnownLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMembers" (
    "groupId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "GroupRole" NOT NULL,

    CONSTRAINT "GroupMembers_pkey" PRIMARY KEY ("groupId","userId")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectParticipant" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "I18nRecord" (
    "id" BIGSERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "I18nRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "I18nRecordData" (
    "id" BIGSERIAL NOT NULL,
    "recordId" BIGINT NOT NULL,
    "language" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "I18nRecordData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "I18nRecordDiscussions" (
    "id" BIGSERIAL NOT NULL,
    "recordId" BIGINT NOT NULL,
    "posterId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "I18nRecordDiscussions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectChatMessage" (
    "id" BIGSERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectVersion" (
    "id" BIGSERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectVersionRecords" (
    "versionId" BIGINT NOT NULL,
    "recordId" BIGINT NOT NULL,

    CONSTRAINT "ProjectVersionRecords_pkey" PRIMARY KEY ("versionId","recordId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserKnownLanguage_userId_language_key" ON "UserKnownLanguage"("userId", "language");

-- AddForeignKey
ALTER TABLE "UserKnownLanguage" ADD CONSTRAINT "UserKnownLanguage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembers" ADD CONSTRAINT "GroupMembers_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembers" ADD CONSTRAINT "GroupMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectParticipant" ADD CONSTRAINT "ProjectParticipant_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectParticipant" ADD CONSTRAINT "ProjectParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "I18nRecord" ADD CONSTRAINT "I18nRecord_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "I18nRecordData" ADD CONSTRAINT "I18nRecordData_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "I18nRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "I18nRecordData" ADD CONSTRAINT "I18nRecordData_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "I18nRecordDiscussions" ADD CONSTRAINT "I18nRecordDiscussions_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "I18nRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "I18nRecordDiscussions" ADD CONSTRAINT "I18nRecordDiscussions_posterId_fkey" FOREIGN KEY ("posterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectChatMessage" ADD CONSTRAINT "ProjectChatMessage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectChatMessage" ADD CONSTRAINT "ProjectChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectVersion" ADD CONSTRAINT "ProjectVersion_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectVersionRecords" ADD CONSTRAINT "ProjectVersionRecords_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "ProjectVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectVersionRecords" ADD CONSTRAINT "ProjectVersionRecords_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "I18nRecordData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
