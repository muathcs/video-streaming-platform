-- CreateTable
CREATE TABLE "Celeb" (
    "celebid" TEXT NOT NULL,
    "displayname" VARCHAR(60),
    "username" VARCHAR(20),
    "followers" INTEGER,
    "account" VARCHAR(30),
    "category" VARCHAR(20),
    "price" INTEGER,
    "email" VARCHAR(60),
    "description" VARCHAR(250),
    "request_num" INTEGER,
    "rating" INTEGER,
    "uid" VARCHAR(42),
    "imgurl" VARCHAR(250),
    "document_with_idx" tsvector,

    CONSTRAINT "Celeb_pkey" PRIMARY KEY ("celebid")
);

-- CreateTable
CREATE TABLE "Fan" (
    "fanid" TEXT NOT NULL,
    "email" VARCHAR(100),
    "displayname" VARCHAR(50),
    "total_spent" INTEGER,
    "fav_categories" VARCHAR(50),
    "num_of_requests" INTEGER,
    "uid" VARCHAR(42) NOT NULL,
    "imgurl" VARCHAR(150),
    "description" VARCHAR(350),

    CONSTRAINT "Fan_pkey" PRIMARY KEY ("fanid")
);

-- CreateTable
CREATE TABLE "Requests" (
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

    CONSTRAINT "Requests_pkey" PRIMARY KEY ("requestid")
);

-- CreateTable
CREATE TABLE "Review" (
    "reviewid" TEXT NOT NULL,
    "reviewer_id" VARCHAR(50) NOT NULL,
    "reviewed_id" VARCHAR(50) NOT NULL,
    "message" VARCHAR(50) NOT NULL,
    "celebCelebid" TEXT,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("reviewid")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notificationid" TEXT NOT NULL,
    "intended_uid" VARCHAR(50),
    "sender_uid" VARCHAR(50),
    "message" TEXT,
    "is_read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notificationid")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "transactionid" TEXT NOT NULL,
    "payee_id" INTEGER,
    "amount" INTEGER,
    "status" VARCHAR(12),
    "payment_date" TIMESTAMP(6),

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("transactionid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Celeb_uid_key" ON "Celeb"("uid");

-- CreateIndex
CREATE INDEX "document_idx" ON "Celeb" USING GIN ("document_with_idx");

-- CreateIndex
CREATE INDEX "document_with_idx_index" ON "Celeb" USING GIN ("document_with_idx");

-- CreateIndex
CREATE UNIQUE INDEX "Fan_uid_key" ON "Fan"("uid");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_celebCelebid_fkey" FOREIGN KEY ("celebCelebid") REFERENCES "Celeb"("celebid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_transactionid_fkey" FOREIGN KEY ("transactionid") REFERENCES "Fan"("fanid") ON DELETE RESTRICT ON UPDATE CASCADE;

