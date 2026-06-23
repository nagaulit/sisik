-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "done" BOOLEAN,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
