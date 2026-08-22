import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/response';
import { config } from '../config';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // 1. Handled Custom ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // 2. Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
      return res.status(409).json({
        success: false,
        message: `A record with this ${target} already exists.`,
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'The requested resource was not found.',
      });
    }

    if (err.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'Invalid foreign key reference provided.',
      });
    }
  }

  // 3. Prisma Initialization / Connection Errors
  if (
    err instanceof Prisma.PrismaClientInitializationError ||
    err instanceof Prisma.PrismaClientRustPanicError
  ) {
    console.error('[Prisma Error]:', err.message);
    return res.status(503).json({
      success: false,
      message: 'Database service is currently unavailable. Please try again later.',
    });
  }

  // 4. General fallback error
  const error = err instanceof Error ? err : new Error('Internal Server Error');
  console.error(`[Unhandled Error]: ${error.message}`);

  const isProduction = config.nodeEnv === 'production';
  return res.status(500).json({
    success: false,
    message: isProduction ? 'Internal Server Error' : error.message || 'Internal Server Error',
  });
}
