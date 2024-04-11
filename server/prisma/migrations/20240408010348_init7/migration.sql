/*
  Warnings:

  - You are about to drop the `Requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_transactionid_fkey";

-- DropTable
DROP TABLE "Requests";

-- DropTable
DROP TABLE "Transactions";

-- CreateTable
CREATE TABLE "Request" (
    "requestid" TEXT NOT NULL,
    "celebuid" VARCHAR(50),
    "fanuid" VARCHAR(50),
    "price" INTEGER,
    "tosomeoneelse" BOOLEAN,
    "reqaction" VARCHAR(16),
    "fromperson" VARCHAR(40),
    "toperson" VARCHAR(40),
    "message" VARCHAR(500),
    "reqstatus" VARCHAR(10),
    "reqtype" VARCHAR(8),
    "timestamp1" TIMESTAMP(6),
    "timestamp2" TIMESTAMP(6),
    "celebmessage" VARCHAR(1200),

    CONSTRAINT "Request_pkey" PRIMARY KEY ("requestid")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "transactionid" TEXT NOT NULL,
    "payee_id" INTEGER,
    "amount" INTEGER,
    "status" VARCHAR(12),
    "payment_date" TIMESTAMP(6),

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transactionid")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_transactionid_fkey" FOREIGN KEY ("transactionid") REFERENCES "Fan"("fanid") ON DELETE RESTRICT ON UPDATE CASCADE;
