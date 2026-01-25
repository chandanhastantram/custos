import { NextRequest, NextResponse } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production for horizontal scaling)
const requestCounts = new Map<string, RateLimitRecord>();

interface RateLimitConfig {
  interval: number;
  maxRequests: number;
}

const defaultConfig: RateLimitConfig = {
  interval: 60000, // 1 minute
  maxRequests: 60, // 60 requests per minute
};

/**
 * Get client identifier from request
 */
function getClientIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  return forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
}

/**
 * Clean up expired entries periodically
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, value] of requestCounts.entries()) {
    if (now > value.resetTime) {
      requestCounts.delete(key);
    }
  }
}

/**
 * Check rate limit for a request
 */
export async function checkRateLimit(
  req: NextRequest,
  config: RateLimitConfig = defaultConfig
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const identifier = getClientIdentifier(req);
  const now = Date.now();
  
  // Cleanup occasionally
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }
  
  const record = requestCounts.get(identifier);
  
  if (!record || now > record.resetTime) {
    // First request or window expired
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + config.interval,
    });
    return { allowed: true, remaining: config.maxRequests - 1, resetTime: now + config.interval };
  }
  
  if (record.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }
  
  record.count++;
  return { allowed: true, remaining: config.maxRequests - record.count, resetTime: record.resetTime };
}

/**
 * Rate limit response
 */
export function rateLimitResponse(resetTime: number): NextResponse {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
  return NextResponse.json(
    { error: 'Too many requests', retryAfter },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Remaining': '0',
      },
    }
  );
}

/**
 * Configuration presets for different endpoint types
 */
export const rateLimitPresets = {
  // Strict for auth endpoints
  auth: { interval: 60000, maxRequests: 5 },
  // Moderate for write operations
  write: { interval: 60000, maxRequests: 30 },
  // Lenient for read operations
  read: { interval: 60000, maxRequests: 100 },
  // AI endpoints (expensive operations)
  ai: { interval: 60000, maxRequests: 10 },
};
