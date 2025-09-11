-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('user', 'admin');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "type" "public"."UserType" NOT NULL DEFAULT 'user';
