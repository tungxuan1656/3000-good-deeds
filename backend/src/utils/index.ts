import { ulid } from 'ulid'

import type { ApiResponse } from '../types'

export * from './datetime'

// Tạo response thành công
export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null,
  }
}

// Tạo response lỗi
export function errorResponse(code: string, message: string): ApiResponse<null> {
  return {
    success: false,
    data: null,
    error: {
      code,
      message,
    },
  }
}

// Error codes
export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  BAD_REQUEST: 'BAD_REQUEST',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  INVALID_TOKEN: 'INVALID_TOKEN',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  DEED_NOT_FOUND: 'DEED_NOT_FOUND',
  NOT_MODIFIED: 'NOT_MODIFIED',
  INVALID_REQUEST: 'INVALID_REQUEST',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
}

// Generate unique ID
export function generateId(prefix: string = ''): string {
  return prefix + ulid()
}

// Tạo JSON response với status code
export function jsonResponse<T>(
  data: ApiResponse<T>,
  status: number = 200,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...headers,
    },
  })
}

// Handle CORS preflight
export function corsResponse(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}

// Utility để lấy timestamp hiện tại
export function getCurrentTimestamp(): number {
  return Date.now()
}

// Parse JSON body an toàn
export async function parseJsonBody<T>(request: Request): Promise<T | null> {
  try {
    const contentType = request.headers.get('content-type')

    if (!contentType || !contentType.includes('application/json')) {
      return null
    }

    return await request.json()
  } catch {
    return null
  }
}
