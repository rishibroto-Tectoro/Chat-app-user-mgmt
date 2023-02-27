-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "ref" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNum" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "ref" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "OwnerId" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_members" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_ref_key" ON "User"("ref");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNum_key" ON "User"("phoneNum");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Group_ref_key" ON "Group"("ref");

-- CreateIndex
CREATE UNIQUE INDEX "_members_AB_unique" ON "_members"("A", "B");

-- CreateIndex
CREATE INDEX "_members_B_index" ON "_members"("B");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_OwnerId_fkey" FOREIGN KEY ("OwnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_members" ADD CONSTRAINT "_members_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_members" ADD CONSTRAINT "_members_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
