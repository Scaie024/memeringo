-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'agent',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "accountId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "users_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sip_trunks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL DEFAULT 5060,
    "username" TEXT,
    "password" TEXT,
    "status" TEXT NOT NULL DEFAULT 'UNREGISTERED',
    "accountId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sip_trunks_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dids" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phoneNumber" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "routeType" TEXT NOT NULL,
    "routeTarget" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'INACTIVE',
    "trunkId" TEXT,
    "accountId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "dids_trunkId_fkey" FOREIGN KEY ("trunkId") REFERENCES "sip_trunks" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "dids_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "call_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "didId" TEXT NOT NULL,
    "fromNumber" TEXT NOT NULL,
    "toNumber" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'INITIATED',
    "recordingUrl" TEXT,
    "transcript" JSONB,
    "accountId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "call_logs_didId_fkey" FOREIGN KEY ("didId") REFERENCES "dids" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "call_logs_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_accountId_idx" ON "users"("accountId");

-- CreateIndex
CREATE INDEX "sip_trunks_accountId_idx" ON "sip_trunks"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "sip_trunks_host_accountId_key" ON "sip_trunks"("host", "accountId");

-- CreateIndex
CREATE INDEX "dids_accountId_idx" ON "dids"("accountId");

-- CreateIndex
CREATE INDEX "dids_trunkId_idx" ON "dids"("trunkId");

-- CreateIndex
CREATE UNIQUE INDEX "dids_phoneNumber_accountId_key" ON "dids"("phoneNumber", "accountId");

-- CreateIndex
CREATE INDEX "call_logs_didId_idx" ON "call_logs"("didId");

-- CreateIndex
CREATE INDEX "call_logs_accountId_idx" ON "call_logs"("accountId");

-- CreateIndex
CREATE INDEX "call_logs_startTime_idx" ON "call_logs"("startTime");
