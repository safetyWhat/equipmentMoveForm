-- DropForeignKey
ALTER TABLE "public"."equipment_moves" DROP CONSTRAINT "equipment_moves_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."equipment_moves" ADD CONSTRAINT "equipment_moves_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
