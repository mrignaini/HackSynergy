import { ApiError } from './response';

export function validateRequiredId(id: unknown, fieldName = 'id'): string {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    throw new ApiError(400, `Invalid or missing parameter: ${fieldName}`);
  }
  return id.trim();
}

export function validateRequiredString(value: unknown, fieldName: string): string {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    throw new ApiError(400, `Field '${fieldName}' is required and must be a non-empty string`);
  }
  return value.trim();
}
