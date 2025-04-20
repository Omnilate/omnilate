/*
 Warnings:
 
 - The primary key for the `Notification` table will be changed. If it partially fails, the table could be left without primary key constraint.
 
 */
-- AlterTable
ALTER SEQUENCE "Notification_id_seq" AS BIGINT;
ALTER TABLE "Notification" ALTER ID TYPE BIGINT;