import { JobStatus, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/response';
import { PaginationParams, formatPaginationMeta } from '../utils/pagination';

export interface CreateJobDto {
  title: string;
  description?: string;
  location: string;
  wage: number;
}

export interface JobFilters {
  search?: string;
  location?: string;
  skill?: string;
  minWage?: number;
  maxWage?: number;
  status?: string;
  sort?: string;
}

// 1. Create Job (Authenticated Hirer)
export async function createJob(userId: string, data: CreateJobDto) {
  const { title, description, location, wage } = data;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    throw new ApiError(400, "Validation failed: 'title' is required");
  }

  if (!location || typeof location !== 'string' || location.trim() === '') {
    throw new ApiError(400, "Validation failed: 'location' is required");
  }

  const numericWage = typeof wage === 'number' ? wage : parseFloat(wage);
  if (isNaN(numericWage) || numericWage <= 0) {
    throw new ApiError(400, "Validation failed: 'wage' must be a number greater than zero");
  }

  // Derive hirer ownership strictly from authenticated user ID
  const hirer = await prisma.hirerProfile.findUnique({
    where: { userId },
  });

  if (!hirer) {
    throw new ApiError(404, 'Hirer profile not found for authenticated user');
  }

  const job = await prisma.job.create({
    data: {
      hirerId: hirer.id,
      title: title.trim(),
      description: description?.trim() || null,
      location: location.trim(),
      wage: numericWage,
      status: JobStatus.OPEN,
    },
    include: {
      hirer: {
        select: {
          id: true,
          name: true,
          companyName: true,
          location: true,
        },
      },
    },
  });

  return job;
}

// 2. Get All Jobs (Public Find Work)
export async function getAllJobs(pagination: PaginationParams, filters?: JobFilters) {
  const { page, limit, skip } = pagination;

  const andConditions: Prisma.JobWhereInput[] = [];

  // Status Filter (Default to OPEN for Find Work if not provided, or support ALL / specific status)
  if (filters?.status && filters.status.toUpperCase() !== 'ALL') {
    const uppercaseStatus = filters.status.toUpperCase() as JobStatus;
    if (Object.values(JobStatus).includes(uppercaseStatus)) {
      andConditions.push({ status: uppercaseStatus });
    }
  } else if (!filters?.status) {
    // Default to OPEN jobs for public find work discovery
    andConditions.push({ status: JobStatus.OPEN });
  }

  // Search Text (title, description, location)
  if (filters?.search && filters.search.trim() !== '') {
    const search = filters.search.trim();
    andConditions.push({
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  // Location Filter
  if (filters?.location && filters.location.trim() !== '' && filters.location.toLowerCase() !== 'all') {
    andConditions.push({
      location: { contains: filters.location.trim(), mode: 'insensitive' },
    });
  }

  // Skill Filter (matching title or description)
  if (filters?.skill && filters.skill.trim() !== '' && filters.skill.toLowerCase() !== 'all') {
    const skillKeyword = filters.skill.trim();
    andConditions.push({
      OR: [
        { title: { contains: skillKeyword, mode: 'insensitive' } },
        { description: { contains: skillKeyword, mode: 'insensitive' } },
      ],
    });
  }

  // Wage Range Filter
  if (filters?.minWage !== undefined && !isNaN(filters.minWage)) {
    andConditions.push({ wage: { gte: filters.minWage } });
  }
  if (filters?.maxWage !== undefined && !isNaN(filters.maxWage)) {
    andConditions.push({ wage: { lte: filters.maxWage } });
  }

  const where: Prisma.JobWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

  // Whitelisted Sorting Options
  let orderBy: Prisma.JobOrderByWithRelationInput = { createdAt: 'desc' };
  if (filters?.sort === 'wage_high' || filters?.sort === 'wage') {
    orderBy = { wage: 'desc' };
  } else if (filters?.sort === 'wage_low') {
    orderBy = { wage: 'asc' };
  } else if (filters?.sort === 'oldest') {
    orderBy = { createdAt: 'asc' };
  } else {
    orderBy = { createdAt: 'desc' };
  }

  const [total, jobs] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      include: {
        hirer: {
          select: {
            id: true,
            name: true,
            companyName: true,
            location: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy,
    }),
  ]);

  return {
    jobs,
    meta: formatPaginationMeta(page, limit, total),
  };
}

// 3. Get Job By ID
export async function getJobById(id: string) {
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      hirer: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      applications: {
        select: {
          id: true,
          status: true,
          createdAt: true,
          workerId: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      workRecord: {
        include: {
          ratings: true,
          payments: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  if (!job) {
    throw new ApiError(404, `Job with ID '${id}' not found`);
  }

  return job;
}
