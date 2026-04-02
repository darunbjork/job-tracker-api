-- CreateEnum
CREATE TYPE "AppStatus" AS ENUM ('Bookmarked', 'Applied', 'Interview', 'Offer', 'Rejected');

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "jobUrl" TEXT NOT NULL,
    "status" "AppStatus" NOT NULL DEFAULT 'Bookmarked',
    "dateApplied" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contactName" TEXT,
    "contactLinkedIn" TEXT,
    "notes" TEXT,
    "followUpDate" TIMESTAMP(3),
    "salaryRange" TEXT,
    "matchScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);
