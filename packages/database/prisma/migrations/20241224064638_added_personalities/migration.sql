-- CreateEnum
CREATE TYPE "ChatVia" AS ENUM ('TEXT', 'AUDIO');

-- CreateTable
CREATE TABLE "ChatLog" (
    "id" TEXT NOT NULL,
    "via" "ChatVia" NOT NULL,
    "message" TEXT,
    "audioRecordingId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioRecording" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "filename" TEXT,
    "transcription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AudioRecording_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Personality" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "settingsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Personality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalitySettings" (
    "id" TEXT NOT NULL,
    "maxContextLength" INTEGER NOT NULL DEFAULT 10,
    "systemPrompt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "personalityId" TEXT,

    CONSTRAINT "PersonalitySettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Personality_settingsId_key" ON "Personality"("settingsId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalitySettings_personalityId_key" ON "PersonalitySettings"("personalityId");

-- AddForeignKey
ALTER TABLE "ChatLog" ADD CONSTRAINT "ChatLog_audioRecordingId_fkey" FOREIGN KEY ("audioRecordingId") REFERENCES "AudioRecording"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatLog" ADD CONSTRAINT "ChatLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personality" ADD CONSTRAINT "Personality_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "PersonalitySettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
