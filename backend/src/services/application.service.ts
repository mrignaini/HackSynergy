import { ApplicationStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/response';
import { PaginationParams, formatPaginationMeta } from '../utils/pagination';

export async function getAllApplications(
  pagination: PaginationParams,
  filters?: { jobId?: string; workerId?: string; status?: string }
) {
  const { page, limit, skip } = pagination;

  const where: any = {};
  if (filters?.jobId) {
    where.jobId = filters.jobId;
  }
  if (filters?.workerId) {
    where.workerId = filters.workerId;
  }
  if (filters?.status) {
    const uppercaseStatus = filters.status.toUpperCase() as ApplicationStatus;
    if (Object.values(ApplicationStatus).includes(uppercaseStatus)) {
      where.status = uppercaseStatus;
    }
  }

  const [total, applications] = await Promise.all([
    prisma.application.count({ where }),
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            wage: true,
            status: true,
            hirer: {
              select: {
                id: true,
                name: true,
                companyName: true,
              },
            },
          },
        },
        worker: {
          select: {
            id: true,
            name: true,
            location: true,
            experience: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    applications,
    meta: formatPaginationMeta(page, limit, total),
  };
}

export async function getApplicationById(id: string) {
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      job: {
        include: {
          hirer: true,
        },
      },
      worker: {
        include: {
          skills: {
            include: {
              skill: true,
            },
          },
          digitalIdentity: true,
        },
      },
    },
  });

  if (!application) {
    throw new ApiError(404, `Application with ID '${id}' not found`);
  }

  return application;
}
// ------------------------
// Worker actions
// ------------------------

/**
 * Apply a worker to a job.
 * Throws 404 if job not found, 400 if job not open, 409 if already applied.
 */
export async function applyToJob(userId: string, jobId: string) {
  // Resolve worker profile
  const workerProfile = await prisma.workerProfile.findUnique({
    where: { userId },
  });
  if (!workerProfile) {
    throw new ApiError(404, 'Worker profile not found');
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { status: true, hirerId: true },
  });
  if (!job) {
    throw new ApiError(404, 'Job not found');
  }
  if (job.status !== 'OPEN') {
    throw new ApiError(400, 'Cannot apply to a non‑open job');
  }

  // Prevent duplicate applications (unique constraint already exists, but we give a friendly error)
  // Prevent duplicate applications – use a findFirst lookup because the generated
  // composite unique field may not be available until the client is regenerated.
  const existing = await prisma.application.findFirst({
    where: { jobId, workerId: workerProfile.id },
  });
  if (existing) {
    throw new ApiError(409, 'You have already applied to this job');
  }

  return prisma.application.create({
    data: {
      job: { connect: { id: jobId } },
      worker: { connect: { id: workerProfile.id } },
      status: ApplicationStatus.PENDING,
    },
  });
}

/**
 * Get paginated applications belonging to the authenticated worker.
 */
export async function getWorkerApplications(
  userId: string,
  pagination: any,
  filter?: { status?: string }
) {
  const workerProfile = await prisma.workerProfile.findUnique({
    where: { userId },
  });
  if (!workerProfile) {
    throw new ApiError(404, 'Worker profile not found');
  }

  const { page, limit, skip } = pagination;
  const where: any = { workerId: workerProfile.id };
  if (filter?.status) {
    const upper = filter.status.toUpperCase() as ApplicationStatus;
    if (Object.values(ApplicationStatus).includes(upper)) {
      where.status = upper;
    }
  }

  const [total, applications] = await Promise.all([
    prisma.application.count({ where }),
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      include: { job: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return { applications, meta: formatPaginationMeta(page, limit, total) };
}

/**
 * Retrieve a single application for a worker, ensuring ownership.
 */
export async function getWorkerApplicationById(userId: string, applicationId: string) {
  const workerProfile = await prisma.workerProfile.findUnique({
    where: { userId },
  });
  if (!workerProfile) {
    throw new ApiError(404, 'Worker profile not found');
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true, worker: true },
  });
  if (!application) {
    throw new ApiError(404, 'Application not found');
  }
  if (application.workerId !== workerProfile.id) {
    throw new ApiError(403, 'Forbidden: Application does not belong to you');
  }
  return application;
}

/**
 * Withdraw a pending application – sets status to WITHDRAWN.
 */
export async function withdrawApplication(userId: string, applicationId: string) {
  const workerProfile = await prisma.workerProfile.findUnique({
    where: { userId },
  });
  if (!workerProfile) {
    throw new ApiError(404, 'Worker profile not found');
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });
  if (!application) {
    throw new ApiError(404, 'Application not found');
  }
  if (application.workerId !== workerProfile.id) {
    throw new ApiError(403, 'Forbidden: Application does not belong to you');
  }
  if (application.status !== ApplicationStatus.PENDING) {
    throw new ApiError(400, 'Only pending applications can be withdrawn');
  }

  return prisma.application.update({
    where: { id: applicationId },
    data: { status: ApplicationStatus.WITHDRAWN },
  });
}

// ------------------------
// Hirer actions
// ------------------------

/**
 * List applicants for a specific job belonging to the authenticated hirer.
 */
export async function listJobApplications(
  hirerUserId: string,
  jobId: string,
  pagination: any,
  filter?: { status?: string }
) {
  const hirerProfile = await prisma.hirerProfile.findUnique({
    where: { userId: hirerUserId },
  });
  if (!hirerProfile) {
    throw new ApiError(404, 'Hirer profile not found');
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { hirerId: true },
  });
  if (!job) {
    throw new ApiError(404, 'Job not found');
  }
  if (job.hirerId !== hirerProfile.id) {
    throw new ApiError(403, 'Forbidden: Job does not belong to you');
  }

  const { page, limit, skip } = pagination;
  const where: any = { jobId };
  if (filter?.status) {
    const upper = filter.status.toUpperCase() as ApplicationStatus;
    if (Object.values(ApplicationStatus).includes(upper)) {
      where.status = upper;
    }
  }

  const [total, applications] = await Promise.all([
    prisma.application.count({ where }),
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      include: { worker: { select: { id: true, name: true, location: true, experience: true, bio: true } } },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return { applications, meta: formatPaginationMeta(page, limit, total) };
}

/**
 * Accept an application (single‑accept rule enforced).
 */
export async function acceptApplication(hirerUserId: string, applicationId: string) {
  return prisma.$transaction(async (tx) => {
    const hirerProfile = await tx.hirerProfile.findUnique({ where: { userId: hirerUserId } });
    if (!hirerProfile) {
      throw new ApiError(404, 'Hirer profile not found');
    }

    const application = await tx.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });
    if (!application) {
      throw new ApiError(404, 'Application not found');
    }
    if (application.job.hirerId !== hirerProfile.id) {
      throw new ApiError(403, 'Forbidden: Application does not belong to your job');
    }
    if (application.status !== ApplicationStatus.PENDING) {
      throw new ApiError(400, 'Only pending applications can be accepted');
    }

    // Enforce single accepted application per job
    const existingAccepted = await tx.application.findFirst({
      where: { jobId: application.jobId, status: ApplicationStatus.APPROVED },
    });
    if (existingAccepted) {
      throw new ApiError(400, 'Job already has an accepted application');
    }

    // Update the chosen application
    const updated = await tx.application.update({
      where: { id: applicationId },
      data: { status: ApplicationStatus.APPROVED },
    });

    // Optionally reject other pending applications
    await tx.application.updateMany({
      where: { jobId: application.jobId, status: ApplicationStatus.PENDING },
      data: { status: ApplicationStatus.REJECTED },
    });

    return updated;
  });
}

/**
 * Reject an application.
 */
export async function rejectApplication(hirerUserId: string, applicationId: string) {
  const hirerProfile = await prisma.hirerProfile.findUnique({ where: { userId: hirerUserId } });
  if (!hirerProfile) {
    throw new ApiError(404, 'Hirer profile not found');
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true },
  });
  if (!application) {
    throw new ApiError(404, 'Application not found');
  }
  if (application.job.hirerId !== hirerProfile.id) {
    throw new ApiError(403, 'Forbidden: Application does not belong to your job');
  }
  if (application.status !== ApplicationStatus.PENDING) {
    throw new ApiError(400, 'Only pending applications can be rejected');
  }

  return prisma.application.update({
    where: { id: applicationId },
    data: { status: ApplicationStatus.REJECTED },
  });
}

/**
 * Retrieve a single application for a hirer, ensuring ownership.
 */
export async function getApplicationByIdForHirer(hirerUserId: string, applicationId: string) {
  const hirerProfile = await prisma.hirerProfile.findUnique({ where: { userId: hirerUserId } });
  if (!hirerProfile) {
    throw new ApiError(404, 'Hirer profile not found');
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: true,
      worker: {
        include: {
          skills: { include: { skill: true } },
          digitalIdentity: true,
        },
      },
    },
  });

  if (!application) {
    throw new ApiError(404, 'Application not found');
  }
  if (application.job.hirerId !== hirerProfile.id) {
    throw new ApiError(403, 'Forbidden: Application does not belong to your job');
  }
  return application;
}

