/*
  Warnings:

  - You are about to drop the column `endTime` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `recurringDays` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Task` table. All the data in the column will be lost.
  - Added the required column `colIndex` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rowIndex` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "endTime",
DROP COLUMN "recurringDays",
DROP COLUMN "startTime",
ADD COLUMN     "colIndex" INTEGER NOT NULL,
ADD COLUMN     "rowIndex" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL,
    "startHour" INTEGER NOT NULL DEFAULT 6,
    "totalHours" INTEGER NOT NULL DEFAULT 16,
    "interval" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Config_userId_key" ON "Config"("userId");

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
