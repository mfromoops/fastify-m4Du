/*
  Warnings:

  - You are about to drop the column `type` on the `TimeLog` table. All the data in the column will be lost.
  - Added the required column `details` to the `TimeLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `log_type` to the `TimeLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_name` to the `TimeLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TimeLog" DROP COLUMN "type",
ADD COLUMN     "details" TEXT NOT NULL,
ADD COLUMN     "log_type" TEXT NOT NULL,
ADD COLUMN     "session_name" TEXT NOT NULL;
