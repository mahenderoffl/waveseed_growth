/*
  Warnings:

  - You are about to drop the column `quote` on the `Testimonial` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Testimonial` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Testimonial` table. All the data in the column will be lost.
  - Added the required column `url` to the `CaseStudy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Testimonial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Testimonial` table without a default value. This is not possible if the table is not empty.

  The fake placeholder rows these tables held (invented client names,
  quotes, and stats) are being replaced with real projects — clearing
  both tables first so the new required columns can be added regardless
  of whether either table already has rows in it.
*/
-- Clear existing rows (fake/placeholder content only — see above)
DELETE FROM "CaseStudy";
DELETE FROM "Testimonial";

-- AlterTable
ALTER TABLE "CaseStudy" ADD COLUMN     "url" TEXT NOT NULL,
ALTER COLUMN "metrics" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Testimonial" DROP COLUMN "quote",
DROP COLUMN "rating",
DROP COLUMN "role",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
