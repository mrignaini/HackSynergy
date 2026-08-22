import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/response';
import { signToken } from '../utils/jwt';
import { config } from '../config';

export interface RegisterDto {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: Role;
  location?: string;
  bio?: string;
  experience?: string;
  companyName?: string;
}

export interface LoginDto {
  email?: string;
  phone?: string;
  password: string;
}

// User selection excluding passwordHash
const safeUserSelect = {
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
      bio: true,
      digitalIdentity: {
        select: {
          publicSlug: true,
          isPublic: true,
        },
      },
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

export async function register(data: RegisterDto) {
  const { name, email, phone, password, role, location, bio, experience, companyName } = data;

  // 1. Validation
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new ApiError(400, "Validation failed: 'name' is required");
  }

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    throw new ApiError(400, 'Validation failed: A valid email address is required');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new ApiError(400, 'Validation failed: Password must be at least 6 characters long');
  }

  if (!role || !Object.values(Role).includes(role)) {
    throw new ApiError(
      400,
      `Validation failed: 'role' must be one of: ${Object.values(Role).join(', ')}`
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone?.trim() || null;

  // 2. Check for duplicate email
  const existingEmailUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existingEmailUser) {
    throw new ApiError(409, `An account with email '${normalizedEmail}' already exists`);
  }

  // 3. Check for duplicate phone (if phone provided)
  if (normalizedPhone) {
    const existingPhoneUser = await prisma.user.findUnique({
      where: { phone: normalizedPhone },
    });
    if (existingPhoneUser) {
      throw new ApiError(409, `An account with phone number '${normalizedPhone}' already exists`);
    }
  }

  // 4. Hash password
  const passwordHash = await bcrypt.hash(password, config.bcryptSaltRounds);

  // 5. Atomic user + profile creation inside a Prisma transaction
  const createdUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: normalizedEmail,
        phone: normalizedPhone,
        passwordHash,
        role,
      },
    });

    if (role === Role.WORKER) {
      const workerProfile = await tx.workerProfile.create({
        data: {
          userId: user.id,
          name: name.trim(),
          location: location?.trim() || 'NCR Region',
          bio: bio?.trim() || null,
          experience: experience?.trim() || '1 Year',
        },
      });

      // Generate public slug for digital identity
      const cleanSlug = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');
      const publicSlug = `${cleanSlug || 'worker'}-${user.id.slice(0, 6)}`;

      await tx.digitalIdentity.create({
        data: {
          workerId: workerProfile.id,
          isPublic: true,
          publicSlug,
        },
      });
    } else if (role === Role.HIRER) {
      await tx.hirerProfile.create({
        data: {
          userId: user.id,
          name: name.trim(),
          location: location?.trim() || 'NCR Region',
          companyName: companyName?.trim() || null,
        },
      });
    }

    return user;
  });

  // 6. Fetch full created user profile safely
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: createdUser.id },
    select: safeUserSelect,
  });

  // 7. Generate JWT
  const token = signToken({
    userId: user.id,
    role: user.role,
  });

  return {
    token,
    user,
  };
}

export async function login(credentials: LoginDto) {
  const { email, phone, password } = credentials;

  if ((!email && !phone) || !password) {
    throw new ApiError(400, 'Validation failed: Email/phone and password are required');
  }

  const normalizedEmail = email ? email.trim().toLowerCase() : undefined;
  const normalizedPhone = phone ? phone.trim() : undefined;

  // 1. Lookup user by email or phone
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
        ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
      ],
    },
  });

  // 2. Consistent authentication failure (prevent enumeration)
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // 3. Verify password hash
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // 4. Retrieve safe user with profiles
  const safeUser = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    select: safeUserSelect,
  });

  // 5. Generate JWT token
  const token = signToken({
    userId: safeUser.id,
    role: safeUser.role,
  });

  return {
    token,
    user: safeUser,
  };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      ...safeUserSelect,
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
    },
  });

  if (!user) {
    throw new ApiError(404, 'User account not found');
  }

  return user;
}
