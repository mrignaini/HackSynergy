import { NextFunction, Request, Response } from 'express';
import { config } from '../config';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const error = err instanceof Error ? err : new Error('Internal Server Error');
  console.error(`[Error Log] ${error.message}`);

  const statusCode =
    typeof err === 'object' && err !== null && 'statusCode' in err
      ? Number((err as { statusCode?: number }).statusCode) || 500
      : typeof err === 'object' && err !== null && 'status' in err
        ? Number((err as { status?: number }).status) || 500
        : 500;

  const isProduction = config.nodeEnv === 'production';

  res.status(statusCode).json({
    success: false,
    message: isProduction && statusCode >= 500 ? 'Internal Server Error' : error.message || 'Internal Server Error',
  });
}
