export const DEFAULT_ALLOWED_ORIGINS = [
  'https://clearpathmedia.ng',
  'https://www.clearpathmedia.ng',
  'https://clearpathmediatv.com',
  'https://www.clearpathmediatv.com',
];

export interface OriginResolveResult {
  origin: string | null;
  error?: string;
}

export function resolveAppOrigin(req: any): OriginResolveResult {
  const isVercelProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

  // Read ALLOWED_APP_ORIGINS environment variable if provided
  const envOriginsStr = process.env.ALLOWED_APP_ORIGINS || '';
  const envOrigins = envOriginsStr
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);

  const allowedOrigins = Array.from(new Set([...DEFAULT_ALLOWED_ORIGINS, ...envOrigins]));

  // Check origin header
  const originHeader = (req.headers?.origin || '').toString().trim().replace(/\/$/, '');
  let refererOrigin = '';
  if (req.headers?.referer) {
    try {
      const refUrl = new URL(req.headers.referer);
      refererOrigin = `${refUrl.protocol}//${refUrl.host}`;
    } catch (_) {}
  }

  let validatedOrigin: string | null = null;

  if (originHeader && allowedOrigins.includes(originHeader)) {
    validatedOrigin = originHeader;
  } else if (refererOrigin && allowedOrigins.includes(refererOrigin)) {
    validatedOrigin = refererOrigin;
  } else {
    // Check host headers
    const hostHeader = (req.headers?.['x-forwarded-host'] || req.headers?.host || '').toString().split(',')[0].trim();
    if (hostHeader) {
      const proto = (req.headers?.['x-forwarded-proto'] || (hostHeader.includes('localhost') ? 'http' : 'https')).toString().split(',')[0].trim();
      const hostOrigin = `${proto}://${hostHeader}`.replace(/\/$/, '');

      if (allowedOrigins.includes(hostOrigin)) {
        validatedOrigin = hostOrigin;
      } else if (!isVercelProd && (hostHeader.includes('localhost') || hostHeader.includes('run.app'))) {
        // AI Studio Preview mode ONLY (non-production)
        validatedOrigin = hostOrigin;
      }
    }
  }

  // Canonical fallback from APP_BASE_URL
  const appBaseUrl = (process.env.APP_BASE_URL || '').trim().replace(/\/$/, '');
  if (!validatedOrigin && appBaseUrl) {
    if (allowedOrigins.includes(appBaseUrl) || appBaseUrl.startsWith('http')) {
      validatedOrigin = appBaseUrl;
    }
  }

  // Production error check if APP_BASE_URL is missing
  if (isVercelProd && !validatedOrigin) {
    if (!process.env.APP_BASE_URL) {
      return {
        origin: null,
        error: 'APP_BASE_URL environment variable is missing in production environment configuration.',
      };
    }
    validatedOrigin = 'https://clearpathmedia.ng';
  }

  // Final fallback
  if (!validatedOrigin) {
    validatedOrigin = appBaseUrl || 'https://clearpathmedia.ng';
  }

  return { origin: validatedOrigin };
}
