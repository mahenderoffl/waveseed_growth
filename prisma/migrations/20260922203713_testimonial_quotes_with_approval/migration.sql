/*
  Warnings:

  - You are about to drop the column `description` on the `Testimonial` table. All the data in the column will be lost.
  - Added the required columns `quote` and `role` to the `Testimonial` table. Given a temporary
    empty-string default rather than requiring the table to be empty, since — unlike the previous
    migration on this table — any existing rows here could be real content someone added via the
    admin panel, not fake placeholder data to discard. New rows always supply real values; a blank
    quote/role only appears for a pre-existing row that predates this migration, and the admin UI
    below is expected to fill those in by hand afterward.

*/
-- AlterTable
ALTER TABLE "Testimonial" DROP COLUMN "description",
ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "quote" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "role" TEXT NOT NULL DEFAULT '';

-- Seed drafted quotes for the four real projects, pending confirmation
-- from each founder — approved defaults to false, so none of these are
-- visible on the public site until reviewed and approved in /admin.
INSERT INTO "Testimonial" (id, name, role, quote, url, initials, color, approved, "order", "createdAt", "updatedAt") VALUES
  ('testimonial-sai-manju', 'Raju Kusa', 'Founder, Sai Manju Driving School', 'WaveSeed built us a clean, simple website that makes it easy for new students to find us and get in touch.', 'https://saimanjudrivingschool.in', 'RK', '#7c3aed', false, 0, now(), now()),
  ('testimonial-sai-raja', 'Rakesh', 'Founder, Sai Raja Motor Driving School', 'Our new website looks professional and makes enrollment so much easier for students.', 'https://sairajamotordrivingschool.in', 'R', '#d97706', false, 1, now(), now()),
  ('testimonial-trefood', 'Suryam D', 'Founder, Trefood', 'WaveSeed gave Trefood a proper online presence — exactly what we needed to look credible to customers.', 'https://trefood.in', 'SD', '#00a387', false, 2, now(), now()),
  ('testimonial-hanmakonda-water', 'Kalyan', 'Founder, Hanmakonda Water Service', 'Now customers can find us online and reach out easily. Simple, and it works.', 'https://hanmakondawaterservice.com', 'K', '#0ea5e9', false, 3, now(), now());
