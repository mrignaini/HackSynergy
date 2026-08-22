-- CreateIndex
CREATE INDEX "Application_workerId_idx" ON "Application"("workerId");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE INDEX "FinancialRecord_workerId_idx" ON "FinancialRecord"("workerId");

-- CreateIndex
CREATE INDEX "Job_hirerId_idx" ON "Job"("hirerId");

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- CreateIndex
CREATE INDEX "Notification_userId_read_idx" ON "Notification"("userId", "read");

-- CreateIndex
CREATE INDEX "Payment_workRecordId_idx" ON "Payment"("workRecordId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Rating_workRecordId_idx" ON "Rating"("workRecordId");

-- CreateIndex
CREATE INDEX "Rating_toUserId_idx" ON "Rating"("toUserId");

-- CreateIndex
CREATE INDEX "SafetyNetRecord_workerId_idx" ON "SafetyNetRecord"("workerId");

-- CreateIndex
CREATE INDEX "WorkRecord_workerId_idx" ON "WorkRecord"("workerId");

-- CreateIndex
CREATE INDEX "WorkRecord_hirerId_idx" ON "WorkRecord"("hirerId");

-- CreateIndex
CREATE INDEX "WorkRecord_status_idx" ON "WorkRecord"("status");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
