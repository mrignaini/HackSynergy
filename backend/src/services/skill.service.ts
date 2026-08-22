import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/response';
import { PaginationParams, formatPaginationMeta } from '../utils/pagination';

export async function getAllSkills(pagination?: PaginationParams) {
  if (!pagination) {
    const skills = await prisma.skill.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { workers: true },
        },
      },
    });
    return { skills, meta: { page: 1, limit: skills.length, total: skills.length, totalPages: 1 } };
  }

  const { page, limit, skip } = pagination;
  const [total, skills] = await Promise.all([
    prisma.skill.count(),
    prisma.skill.findMany({
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { workers: true },
        },
      },
    }),
  ]);

  return {
    skills,
    meta: formatPaginationMeta(page, limit, total),
  };
}

export async function getSkillById(id: string) {
  const skill = await prisma.skill.findUnique({
    where: { id },
    include: {
      workers: {
        include: {
          worker: {
            select: {
              id: true,
              name: true,
              location: true,
              experience: true,
            },
          },
        },
      },
    },
  });

  if (!skill) {
    throw new ApiError(404, `Skill with ID '${id}' not found`);
  }

  return skill;
}

export async function createSkill(name: string) {
  const normalizedName = name.trim();
  const existing = await prisma.skill.findUnique({
    where: { name: normalizedName },
  });

  if (existing) {
    throw new ApiError(409, `Skill '${normalizedName}' already exists`);
  }

  const skill = await prisma.skill.create({
    data: {
      name: normalizedName,
    },
  });

  return skill;
}
