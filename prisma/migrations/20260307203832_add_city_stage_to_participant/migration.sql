/*
  Warnings:

  - Added the required column `city` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stage` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "resetToken" TEXT;
ALTER TABLE "User" ADD COLUMN "resetTokenExpiry" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Participant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "ideaDesc" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Participant" ("createdAt", "fullName", "id", "ideaDesc", "nationalId", "phone", "school", "userId") SELECT "createdAt", "fullName", "id", "ideaDesc", "nationalId", "phone", "school", "userId" FROM "Participant";
DROP TABLE "Participant";
ALTER TABLE "new_Participant" RENAME TO "Participant";
CREATE UNIQUE INDEX "Participant_userId_key" ON "Participant"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
