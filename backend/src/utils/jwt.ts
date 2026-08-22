import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { config } from '../config';
import { ApiError } from './response';

export interface TokenPayload {
  userId: string;
  role: Role;
}

export function signToken(payload: TokenPayload): string {
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as unknown as number | SignOptions['expiresIn'],
  };
  return jwt.sign(payload, config.jwtSecret as Secret, options);
}

export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, config.jwtSecret as Secret) as TokenPayload;
    if (!decoded.userId || !decoded.role) {
      throw new ApiError(401, 'Invalid authentication token structure');
    }
    return decoded;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Authentication token has expired');
    }
    throw new ApiError(401, 'Invalid authentication token');
  }
}
