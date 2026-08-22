import { JobStatus, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/response';
import { PaginationParams, formatPaginationMeta } from '../utils/pagination';

export interface UpdateHirerProfileDto {
  name?: string;
  location?: string;
  companyName?: string;
}

export interface UpdateHirerJobDto {
  title?: string;
  description?: string;
  location?: string;
  wage?: number;
}

// 1. Get Authenticated Hirer's Own Profile
export async function getHirerProfileByUserId(userId: string) {
  const hirer = await prisma.hirerProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          jobs: true,
          workRecords: true,
        },
      },
    },
  });

  if (!hirer) {
    throw new ApiError(404, 'Hirer profile not found for authenticated user');
  }

  return hirer;
}

// 2. Update Authenticated Hirer's Own Profile
export async function updateHirerProfileByUserId(userId: string, data: UpdateHirerProfileDto) {
  if (!data || typeof data !== 'object') {
    throw new ApiError(400, 'Invalid update payload');
  }

  const updateData: {
    name?: string;
    location?: string;
    companyName?: string | null;
  } = {};

  if (data.name !== undefined) {
    if (typeof data.name !== 'string' || data.name.trim() === '') {
      throw new ApiError(400, "Validation failed: 'name' must be a non-empty string");
    }
    updateData.name = data.name.trim();
  }

  if (data.location !== undefined) {
    if (typeof data.location !== 'string' || data.location.trim() === '') {
      throw new ApiError(400, "Validation failed: 'location' must be a non-empty string");
    }
    updateData.location = data.location.trim();
  }

  if (data.companyName !== undefined) {
    updateData.companyName = data.companyName?.trim() || null;
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, 'No valid fields provided to update');
  }

  const hirer = await prisma.hirerProfile.findUnique({
    where: { userId },
  });

  if (!hirer) {
    throw new ApiError(404, 'Hirer profile not found for authenticated user');
  }

  const updatedHirer = await prisma.hirerProfile.update({
    where: { id: hirer.id },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
        },
      },
    },
  });

  return updatedHirer;
}

// 3. Get Authenticated Hirer's Jobs
export async function getHirerJobs(
  userId: string,
  pagination: PaginationParams,
  filters?: { status?: string }
) {
  const hirer = await prisma.hirerProfile.findUnique({
    where: { userId },
  });

  if (!hirer) {
    throw new ApiError(404, 'Hirer profile not found for authenticated user');
  }

  const { page, limit, skip } = pagination;
  const where: Prisma.JobWhereInput = {
    hirerId: hirer.id,
  };

  if (filters?.status && filters.status.toUpperCase() !== 'ALL') {
    const uppercaseStatus = filters.status.toUpperCase() as JobStatus;
    if (Object.values(JobStatus).includes(uppercaseStatus)) {
      where.status = uppercaseStatus;
    }
  }

  const [total, jobs] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
        workRecord: {
          select: {
            id: true,
            status: true,
            workerId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    jobs,
    meta: formatPaginationMeta(page, limit, total),
  };
}

// 4. Get Single Job Owned by Authenticated Hirer
export async function getHirerJobById(userId: string, jobId: string) {
  const hirer = await prisma.hirerProfile.findUnique({
    where: { userId },
  });

  if (!hirer) {
    throw new ApiError(404, 'Hirer profile not found for authenticated user');
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      applications: {
        include: {
          worker: {
            select: {
              id: true,
              name: true,
              location: true,
              experience: true,
              skills: {
                include: {
                  skill: true,
                },
              },
              digitalIdentity: {
                select: {
                  publicSlug: true,
                  isPublic: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      workRecord: {
        include: {
          ratings: true,
          payments: true,
        },
      },
    },
  });

  if (!job) {
    throw new ApiError(404, `Job with ID '${jobId}' not found`);
  }

  // Enforce ownership
  if (job.hirerId !== hirer.id) {
    throw new ApiError(403, 'Access denied: You do not own this job listing');
  }

  return job;
}

// 5. Update Job Owned by Authenticated Hirer
export async function updateHirerJob(userId: string, jobId: string, data: UpdateHirerJobDto) {
  if (!data || typeof data !== 'object') {
    throw new ApiError(400, 'Invalid update payload');
  }

  const hirer = await prisma.hirerProfile.findUnique({
    where: { userId },
  });

  if (!hirer) {
    throw new ApiError(404, 'Hirer profile not found for authenticated user');
  }

  const existingJob = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!existingJob) {
    throw new ApiError(404, `Job with ID '${jobId}' not found`);
  }

  if (existingJob.hirerId !== hirer.id) {
    throw new ApiError(403, 'Access denied: You cannot edit a job you do not own');
  }

  const updateData: Prisma.JobUpdateInput = {};

  if (data.title !== undefined) {
    if (typeof data.title !== 'string' || data.title.trim() === '') {
      throw new ApiError(400, "Validation failed: 'title' must be a non-empty string");
    }
    updateData.title = data.title.trim();
  }

  if (data.description !== undefined) {
    updateData.description = data.description?.trim() || null;
  }

  if (data.location !== undefined) {
    if (typeof data.location !== 'string' || data.location.trim() === '') {
      throw new ApiError(400, "Validation failed: 'location' must be a non-empty string");
    }
    updateData.location = data.location.trim();
  }

  if (data.wage !== undefined) {
    const numericWage = typeof data.wage === 'number' ? data.wage : parseFloat(data.wage);
    if (isNaN(numericWage) || numericWage <= 0) {
      throw new ApiError(400, 'Validation failed: Wage must be greater than zero');
    }
    updateData.wage = numericWage;
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, 'No valid fields provided to update');
  }

  const updatedJob = await prisma.job.update({
    where: { id: jobId },
    data: updateData,
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  return updatedJob;
}

// 6. Update Job Status Owned by Authenticated Hirer
export async function updateHirerJobStatus(userId: string, jobId: string, status: string) {
  if (!status || typeof status !== 'string') {
    throw new ApiError(400, "Validation failed: 'status' is required");
  }

  const uppercaseStatus = status.trim().toUpperCase() as JobStatus;
  if (!Object.values(JobStatus).includes(uppercaseStatus)) {
    throw new ApiError(
      400,
      `Invalid status. Must be one of: ${Object.values(JobStatus).join(', ')}`
    );
  }

  const hirer = await prisma.hirerProfile.findUnique({
    where: { userId },
  });

  if (!hirer) {
    throw new ApiError(404, 'Hirer profile not found for authenticated user');
  }

  const existingJob = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!existingJob) {
    throw new ApiError(404, `Job with ID '${jobId}' not found`);
  }

  if (existingJob.hirerId !== hirer.id) {
    throw new ApiError(403, 'Access denied: You cannot modify status of a job you do not own');
  }

  const updatedJob = await prisma.job.update({
    where: { id: jobId },
    data: { status: uppercaseStatus },
  });

  return updatedJob;
}

// 7. Cancel / Close Job Owned by Authenticated Hirer
export async function cancelOrDeleteHirerJob(userId: string, jobId: string) {
  const hirer = await prisma.hirerProfile.findUnique({
    where: { userId },
  });

  if (!hirer) {
    throw new ApiError(404, 'Hirer profile not found for authenticated user');
  }

  const existingJob = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!existingJob) {
    throw new ApiError(404, `Job with ID '${jobId}' not found`);
  }

  if (existingJob.hirerId !== hirer.id) {
    throw new ApiError(403, 'Access denied: You cannot cancel a job you do not own');
  }

  // Set status to CLOSED to preserve relational integrity
  const closedJob = await prisma.job.update({
    where: { id: jobId },
    data: { status: JobStatus.CLOSED },
  });

  return {
    message: 'Job cancelled successfully',
    jobId: closedJob.id,
    status: closedJob.status,
  };
}

// 8. Get Hirer Dashboard Statistics
export async function getHirerStats(userId: string) {
  const hirer = await prisma.hirerProfile.findUnique({
    where: { userId },
  });

  if (!hirer) {
    throw new ApiError(404, 'Hirer profile not found for authenticated user');
  }

  const [totalJobs, openJobs, inProgressJobs, completedJobs, closedJobs, totalApplications] =
    await Promise.all([
      prisma.job.count({ where: { hirerId: hirer.id } }),
      prisma.job.count({ where: { hirerId: hirer.id, status: JobStatus.OPEN } }),
      prisma.job.count({ where: { hirerId: hirer.id, status: JobStatus.IN_PROGRESS } }),
      prisma.job.count({ where: { hirerId: hirer.id, status: JobStatus.COMPLETED } }),
      prisma.job.count({ where: { hirerId: hirer.id, status: JobStatus.CLOSED } }),
      prisma.application.count({ where: { job: { hirerId: hirer.id } } }),
    ]);

  return {
    totalJobs,
    openJobs,
    inProgressJobs,
    completedJobs,
    closedJobs,
    totalApplications,
  };
}

// 9. Get All Hirers (B2 Foundation)
export async function getAllHirers(pagination: PaginationParams) {
  const { page, limit, skip } = pagination;

  const [total, hirers] = await Promise.all([
    prisma.hirerProfile.count(),
    prisma.hirerProfile.findMany({
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            role: true,
          },
        },
        _count: {
          select: {
            jobs: true,
            workRecords: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    hirers,
    meta: formatPaginationMeta(page, limit, total),
  };
}

// 10. Get Hirer By ID (B2 Foundation)
export async function getHirerById(id: string) {
  const hirer = await prisma.hirerProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
        },
      },
      jobs: {
        orderBy: { createdAt: 'desc' },
      },
      workRecords: {
        include: {
          worker: {
            select: {
              id: true,
              name: true,
              location: true,
            },
          },
        },
        orderBy: { startedAt: 'desc' },
      },
    },
  });

  if (!hirer) {
    throw new ApiError(404, `Hirer profile with ID '${id}' not found`);
  }

  return hirer;
}
