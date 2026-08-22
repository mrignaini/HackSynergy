import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export function getHealth(_req: Request, res: Response) {
  res.status(200).json({
    success: true,
    message: 'SHRAMIKK backend is running',
  });
}

export async function getDatabaseHealth(_req: Request, res: Response) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      message: 'Database connection successful',
    });
  } catch (error) {
    console.error('Database connection test failed');
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
    });
  }
}
