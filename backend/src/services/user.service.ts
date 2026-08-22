import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/response';
import { PaginationParams, formatPaginationMeta } from '../utils/pagination';

// Safe user selection excluding passwordHash
const userSelect = {
  id: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  workerProfile: {
    select: {
      id: true,
      name: true,
      location: true,
      experience: true,
    },
  },
  hirerProfile: {
    select: {
      id: true,
      name: true,
      location: true,
      companyName: true,
    },
  },
};

export async function getAllUsers(pagination: PaginationParams) {
  const { page, limit, skip } = pagination;

  const [total, users] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      skip,
      take: limit,
      select: userSelect,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    users,
    meta: formatPaginationMeta(page, limit, total),
  };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      ...userSelect,
      workerProfile: {
        include: {
          skills: {
            include: {
              skill: true,
            },
          },
          digitalIdentity: true,
        },
      },
      hirerProfile: {
        include: {
          jobs: {
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
        },
      },
      notifications: {
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, `User with ID '${id}' not found`);
  }

  return user;
}
