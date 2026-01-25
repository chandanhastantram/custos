import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { MongoError } from 'mongodb';

/**
 * Standardized error response
 */
export interface ErrorResponse {
  error: string;
  message?: string;
  details?: any;
  requestId?: string;
  timestamp: string;
}

/**
 * Generate unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Handle API errors with proper logging and responses
 */
export function handleApiError(error: any, context?: string): NextResponse {
  const requestId = generateRequestId();
  const timestamp = new Date().toISOString();
  
  // Log error (in production, send to monitoring service)
  console.error(`[${requestId}] ${context || 'API Error'}:`, {
    error: error.message,
    stack: error.stack,
    timestamp,
  });
  
  // Zod validation errors
  if (error?.name === 'ZodError' || error?.issues) {
    const zodError = error as any;
    return NextResponse.json<ErrorResponse>(
      {
        error: 'Validation failed',
        message: 'Invalid input data',
        details: zodError.issues?.map((e: any) => ({
          field: e.path?.join('.') || 'unknown',
          message: e.message,
        })) || zodError.errors?.map((e: any) => ({
          field: e.path?.join('.') || 'unknown',
          message: e.message,
        })),
        requestId,
        timestamp,
      },
      { status: 400 }
    );
  }
  
  // MongoDB duplicate key error
  if (error instanceof MongoError && error.code === 11000) {
    return NextResponse.json<ErrorResponse>(
      {
        error: 'Duplicate entry',
        message: 'A record with this information already exists',
        requestId,
        timestamp,
      },
      { status: 409 }
    );
  }
  
  // MongoDB cast error (invalid ObjectId)
  if (error.name === 'CastError') {
    return NextResponse.json<ErrorResponse>(
      {
        error: 'Invalid ID',
        message: 'The provided ID is not valid',
        requestId,
        timestamp,
      },
      { status: 400 }
    );
  }
  
  // Authentication errors
  if (error.message?.includes('Unauthorized') || error.message?.includes('authentication')) {
    return NextResponse.json<ErrorResponse>(
      {
        error: 'Unauthorized',
        message: 'Please log in to access this resource',
        requestId,
        timestamp,
      },
      { status: 401 }
    );
  }
  
  // Authorization errors
  if (error.message?.includes('Forbidden') || error.message?.includes('permission')) {
    return NextResponse.json<ErrorResponse>(
      {
        error: 'Forbidden',
        message: 'You do not have permission to perform this action',
        requestId,
        timestamp,
      },
      { status: 403 }
    );
  }
  
  // Generic server error (don't expose internal details)
  return NextResponse.json<ErrorResponse>(
    {
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      requestId,
      timestamp,
    },
    { status: 500 }
  );
}

/**
 * Success response helper
 */
export function successResponse<T>(data: T, message?: string, status: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Pagination response helper
 */
export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
    timestamp: new Date().toISOString(),
  });
}
