import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/response';
import { PaginationParams, formatPaginationMeta } from '../utils/pagination';

export async function getAllSchemes(
  pagination?: PaginationParams,
  filters?: { activeOnly?: boolean }
) {
  const where: any = {};
  if (filters?.activeOnly !== undefined) {
    where.active = filters.activeOnly;
  }

  if (!pagination) {
    const schemes = await prisma.governmentScheme.findMany({
      where,
      orderBy: { name: 'asc' },
    });
    return { schemes, meta: { page: 1, limit: schemes.length, total: schemes.length, totalPages: 1 } };
  }

  const { page, limit, skip } = pagination;
  const [total, schemes] = await Promise.all([
    prisma.governmentScheme.count({ where }),
    prisma.governmentScheme.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
    }),
  ]);

  return {
    schemes,
    meta: formatPaginationMeta(page, limit, total),
  };
}

export async function getSchemeById(id: string) {
  const scheme = await prisma.governmentScheme.findUnique({
    where: { id },
  });

  if (!scheme) {
    throw new ApiError(404, `Government scheme with ID '${id}' not found`);
  }

  return scheme;
}
