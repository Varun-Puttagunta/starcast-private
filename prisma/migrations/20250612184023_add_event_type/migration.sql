/*
  Warnings:

  - You are about to drop the `UserProgress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `eventType` to the `SavedEvent` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserProgress_userId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserProgress";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SavedEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventDate" DATETIME NOT NULL,
    "description" TEXT,
    "eventType" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SavedEvent" ("createdAt", "description", "eventDate", "eventId", "eventName", "id", "userId") SELECT "createdAt", "description", "eventDate", "eventId", "eventName", "id", "userId" FROM "SavedEvent";
DROP TABLE "SavedEvent";
ALTER TABLE "new_SavedEvent" RENAME TO "SavedEvent";
CREATE UNIQUE INDEX "SavedEvent_userId_eventId_key" ON "SavedEvent"("userId", "eventId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
