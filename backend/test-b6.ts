// test-b6.ts – end‑to‑end test for B6 application workflow
import { prisma } from './src/lib/prisma';
import * as appService from './src/services/application.service';
import { ApplicationStatus, Role } from '@prisma/client';
import { hashSync } from 'bcryptjs';

async function main() {
  // Clean up any prior test data (optional)
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.hirerProfile.deleteMany();
  await prisma.workerProfile.deleteMany();
  await prisma.user.deleteMany({ where: { email: { endsWith: '@example.com' } } });

  // Create a hirer user & profile
  const hirerUser = await prisma.user.create({
    data: { email: 'hirer@example.com', passwordHash: hashSync('pw', 10), role: Role.HIRER },
  });
  const hirerProfile = await prisma.hirerProfile.create({
    data: { userId: hirerUser.id, name: 'Hirer Co', location: 'City', companyName: 'Hirer Ltd' },
  });

  // Create two workers
  const workerUser1 = await prisma.user.create({
    data: { email: 'worker1@example.com', passwordHash: hashSync('pw', 10), role: Role.WORKER },
  });
  const workerProfile1 = await prisma.workerProfile.create({
    data: { userId: workerUser1.id, name: 'Worker One', location: 'Town' },
  });
  const workerUser2 = await prisma.user.create({
    data: { email: 'worker2@example.com', passwordHash: hashSync('pw', 10), role: Role.WORKER },
  });
  const workerProfile2 = await prisma.workerProfile.create({
    data: { userId: workerUser2.id, name: 'Worker Two', location: 'Village' },
  });

  // Create an OPEN job owned by the hirer
  const job = await prisma.job.create({
    data: { hirerId: hirerProfile.id, title: 'Test Job', location: 'Remote', wage: 500 },
  });

  // Workers apply to the job
  const app1 = await appService.applyToJob(workerUser1.id, job.id);
  console.log('Worker1 applied →', app1.id);
  const app2 = await appService.applyToJob(workerUser2.id, job.id);
  console.log('Worker2 applied →', app2.id);

  // Hirer lists applicants
  const { applications } = await appService.listJobApplications(hirerUser.id, job.id, { page: 1, limit: 10, skip: 0 });
  console.log('Applicants:', applications.map(a => ({ id: a.id, workerId: a.workerId, status: a.status })));

  // Hirer accepts the first application (single‑accept rule enforced)
  const accepted = await appService.acceptApplication(hirerUser.id, app1.id);
  console.log('Accepted application status:', accepted.status);

  // Verify the other application was automatically rejected
  const refreshedApp2 = await appService.getApplicationById(app2.id);
  console.log('Second application status after accept:', refreshedApp2.status);

  // Attempt illegal withdraws to test error handling
  try {
    await appService.withdrawApplication(workerUser1.id, app1.id);
  } catch (e: any) {
    console.log('Withdraw error (approved app):', e.message);
  }
  try {
    await appService.withdrawApplication(workerUser2.id, app2.id);
  } catch (e: any) {
    console.log('Withdraw error (rejected app):', e.message);
  }
}

main()
  .then(() => {
    console.log('✅ B6 workflow test completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  });
