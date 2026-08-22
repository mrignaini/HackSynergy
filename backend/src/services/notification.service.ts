import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/response';
import { PaginationParams, formatPaginationMeta } from '../utils/pagination';

export async function getAllNotifications(
  pagination: PaginationParams,
  filters?: { userId?: string; read?: boolean }
) {
  const { page, limit, skip } = pagination;

  const where: any = {};
  if (filters?.userId) {
    where.userId = filters.userId;
  }
  if (filters?.read !== undefined) {
    where.read = filters.read;
  }

  const [total, notifications] = await Promise.all([
    prisma.notification.count({ where }),
    prisma.notification.findMany({
      where,
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
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    notifications,
    meta: formatPaginationMeta(page, limit, total),
  };
}

export async function getNotificationById(id: string) {
  const notification = await prisma.notification.findUnique({
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
    },
  });

  if (!notification) {
    throw new ApiError(404, `Notification with ID '${id}' not found`);
  }

  return notification;
}
