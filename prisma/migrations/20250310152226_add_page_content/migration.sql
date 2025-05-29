-- CreateEnum
CREATE TYPE "PageType" AS ENUM ('ABOUT');

-- CreateTable
CREATE TABLE "PagesContent" (
    "id" TEXT NOT NULL,
    "pageType" "PageType" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PagesContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PagesContent_pageType_key" ON "PagesContent"("pageType");
