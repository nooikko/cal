/*
  Warnings:

  - You are about to drop the column `personalityId` on the `PersonalitySettings` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('USER', 'SYSTEM');

-- DropIndex
DROP INDEX "PersonalitySettings_personalityId_key";

-- AlterTable
ALTER TABLE "ChatLog" ADD COLUMN     "personalityId" TEXT,
ADD COLUMN     "senderType" "SenderType" NOT NULL DEFAULT 'USER',
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PersonalitySettings" DROP COLUMN "personalityId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "selectedPersonalityId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_selectedPersonalityId_fkey" FOREIGN KEY ("selectedPersonalityId") REFERENCES "Personality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatLog" ADD CONSTRAINT "ChatLog_personalityId_fkey" FOREIGN KEY ("personalityId") REFERENCES "Personality"("id") ON DELETE CASCADE ON UPDATE CASCADE;
