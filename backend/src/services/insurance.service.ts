import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/response';
import { PaginationParams, formatPaginationMeta } from '../utils/pagination';

export async function getAllInsurance(
  pagination?: PaginationParams,
  filters?: { activeOnly?: boolean; provider?: string }
) {
  const where: any = {};
  if (filters?.activeOnly !== undefined) {
    where.active = filters.activeOnly;
  }
  if (filters?.provider) {
    where.provider = { contains: filters.provider, mode: 'insensitive' };
  }

  if (!pagination) {
    const insurance = await prisma.insuranceOption.findMany({
      where,
      orderBy: { name: 'asc' },
    });
    return { insurance, meta: { page: 1, limit: insurance.length, total: insurance.length, totalPages: 1 } };
  }

  const { page, limit, skip } = pagination;
  const [total, insurance] = await Promise.all([
    prisma.insuranceOption.count({ where }),
    prisma.insuranceOption.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
    }),
  ]);

  return {
    insurance,
    meta: formatPaginationMeta(page, limit, total),
  };
}

export async function getInsuranceById(id: string) {
  const option = await prisma.insuranceOption.findUnique({
    where: { id },
  });

  if (!option) {
    throw new ApiError(404, `Insurance option with ID '${id}' not found`);
  }

  return option;
}
