import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/response';
import { PaginationParams, formatPaginationMeta } from '../utils/pagination';

export interface UpdateWorkerProfileDto {
  name?: string;
  location?: string;
  bio?: string;
  experience?: string;
}

export interface AddWorkerSkillDto {
  skillId?: string;
  name?: string;
}

// 1. Get Own Worker Profile
export async function getWorkerProfileByUserId(userId: string) {
  const worker = await prisma.workerProfile.findUnique({
    where: { userId },
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
      digitalIdentity: {
        select: {
          id: true,
          isPublic: true,
          publicSlug: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });

  if (!worker) {
    throw new ApiError(404, 'Worker profile not found for authenticated user');
  }

  return worker;
}

// 2. Update Own Worker Profile
export async function updateWorkerProfileByUserId(userId: string, data: UpdateWorkerProfileDto) {
  if (!data || typeof data !== 'object') {
    throw new ApiError(400, 'Invalid update payload');
  }

  const updateData: {
    name?: string;
    location?: string;
    bio?: string | null;
    experience?: string | null;
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

  if (data.bio !== undefined) {
    updateData.bio = data.bio?.trim() || null;
  }

  if (data.experience !== undefined) {
    updateData.experience = data.experience?.trim() || null;
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, 'No valid fields provided to update');
  }

  const worker = await prisma.workerProfile.findUnique({
    where: { userId },
  });

  if (!worker) {
    throw new ApiError(404, 'Worker profile not found for authenticated user');
  }

  const updatedWorker = await prisma.workerProfile.update({
    where: { id: worker.id },
    data: updateData,
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
      digitalIdentity: {
        select: {
          id: true,
          isPublic: true,
          publicSlug: true,
        },
      },
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

  return updatedWorker;
}

// 3. Get Own Worker Skills
export async function getWorkerSkills(userId: string) {
  const worker = await prisma.workerProfile.findUnique({
    where: { userId },
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
    },
  });

  if (!worker) {
    throw new ApiError(404, 'Worker profile not found for authenticated user');
  }

  return worker.skills.map((ws) => ({
    skillId: ws.skillId,
    name: ws.skill.name,
  }));
}

// 4. Add Skill to Worker Profile
export async function addWorkerSkill(userId: string, skillData: AddWorkerSkillDto) {
  const { skillId, name } = skillData;

  if (!skillId && !name) {
    throw new ApiError(400, "Validation failed: Either 'skillId' or 'name' is required");
  }

  const worker = await prisma.workerProfile.findUnique({
    where: { userId },
  });

  if (!worker) {
    throw new ApiError(404, 'Worker profile not found for authenticated user');
  }

  let targetSkillId = skillId;

  if (skillId) {
    const existingSkill = await prisma.skill.findUnique({
      where: { id: skillId },
    });
    if (!existingSkill) {
      throw new ApiError(404, `Skill with ID '${skillId}' not found`);
    }
  } else if (name) {
    const normalizedName = name.trim();
    if (!normalizedName) {
      throw new ApiError(400, "Validation failed: 'name' must not be empty");
    }

    let existingSkill = await prisma.skill.findUnique({
      where: { name: normalizedName },
    });

    if (!existingSkill) {
      existingSkill = await prisma.skill.create({
        data: { name: normalizedName },
      });
    }

    targetSkillId = existingSkill.id;
  }

  if (!targetSkillId) {
    throw new ApiError(400, 'Invalid skill identifier');
  }

  // Check if worker already has this skill
  const alreadyHasSkill = await prisma.workerSkill.findUnique({
    where: {
      workerId_skillId: {
        workerId: worker.id,
        skillId: targetSkillId,
      },
    },
  });

  if (alreadyHasSkill) {
    throw new ApiError(409, 'Skill already added to worker profile');
  }

  // Add WorkerSkill relation
  const newWorkerSkill = await prisma.workerSkill.create({
    data: {
      workerId: worker.id,
      skillId: targetSkillId,
    },
    include: {
      skill: true,
    },
  });

  return {
    skillId: newWorkerSkill.skillId,
    name: newWorkerSkill.skill.name,
  };
}

// 5. Remove Skill from Worker Profile
export async function removeWorkerSkill(userId: string, skillId: string) {
  if (!skillId || typeof skillId !== 'string' || skillId.trim() === '') {
    throw new ApiError(400, "Validation failed: 'skillId' is required");
  }

  const worker = await prisma.workerProfile.findUnique({
    where: { userId },
  });

  if (!worker) {
    throw new ApiError(404, 'Worker profile not found for authenticated user');
  }

  const workerSkill = await prisma.workerSkill.findUnique({
    where: {
      workerId_skillId: {
        workerId: worker.id,
        skillId: skillId.trim(),
      },
    },
  });

  if (!workerSkill) {
    throw new ApiError(404, 'Skill is not assigned to worker profile');
  }

  await prisma.workerSkill.delete({
    where: {
      workerId_skillId: {
        workerId: worker.id,
        skillId: skillId.trim(),
      },
    },
  });

  return {
    message: 'Skill removed successfully',
    skillId: skillId.trim(),
  };
}

// 6. Get Matched Jobs For Authenticated Worker
export async function getMatchedJobsForWorker(userId: string, pagination: PaginationParams) {
  const worker = await prisma.workerProfile.findUnique({
    where: { userId },
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
    },
  });

  if (!worker) {
    throw new ApiError(404, 'Worker profile not found for authenticated user');
  }

  const { page, limit, skip } = pagination;
  const workerSkills = worker.skills.map((ws) => ws.skill.name.toLowerCase());
  const workerLocation = worker.location.toLowerCase();

  // Match jobs by location or skill keywords in title / description
  const where: any = {
    status: 'OPEN',
    OR: [
      { location: { contains: workerLocation, mode: 'insensitive' } },
      ...workerSkills.map((s) => ({ title: { contains: s, mode: 'insensitive' } })),
      ...workerSkills.map((s) => ({ description: { contains: s, mode: 'insensitive' } })),
    ],
  };

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
          select: { applications: true },
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

// 7. Get All Workers (B2 Foundation)
export async function getAllWorkers(
  pagination: PaginationParams,
  filters?: { location?: string; skillId?: string }
) {
  const { page, limit, skip } = pagination;

  const where: any = {};
  if (filters?.location) {
    where.location = { contains: filters.location, mode: 'insensitive' };
  }
  if (filters?.skillId) {
    where.skills = {
      some: {
        skillId: filters.skillId,
      },
    };
  }

  const [total, workers] = await Promise.all([
    prisma.workerProfile.count({ where }),
    prisma.workerProfile.findMany({
      where,
      skip,
      take: limit,
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        digitalIdentity: {
          select: {
            id: true,
            isPublic: true,
            publicSlug: true,
          },
        },
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
    workers,
    meta: formatPaginationMeta(page, limit, total),
  };
}

// 8. Get Worker By ID (B2 Foundation)
export async function getWorkerById(id: string) {
  const worker = await prisma.workerProfile.findUnique({
    where: { id },
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
      digitalIdentity: true,
      user: {
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
        },
      },
      workRecords: {
        include: {
          job: {
            select: {
              title: true,
              location: true,
            },
          },
          ratings: true,
          payments: true,
        },
        orderBy: { startedAt: 'desc' },
      },
      applications: {
        include: {
          job: {
            select: {
              id: true,
              title: true,
              wage: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!worker) {
    throw new ApiError(404, `Worker profile with ID '${id}' not found`);
  }

  return worker;
}
