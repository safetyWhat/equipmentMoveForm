-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_moves" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "unitNumber" TEXT NOT NULL,
    "moveDate" TIMESTAMP(3) NOT NULL,
    "equipmentHours" DOUBLE PRECISION NOT NULL,
    "locationFrom" TEXT NOT NULL,
    "locationTo" TEXT NOT NULL,
    "notes" TEXT,
    "photos" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "equipment_moves_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_moves_submissionId_key" ON "equipment_moves"("submissionId");

-- AddForeignKey
ALTER TABLE "equipment_moves" ADD CONSTRAINT "equipment_moves_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
