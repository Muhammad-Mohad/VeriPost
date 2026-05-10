const FLASK_URL = process.env.FLASK_API_URL || 'http://localhost:5000';

export const flaskUrl = (path: string) =>
  `${FLASK_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

export interface ProxyOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  formData?: FormData;
  headers?: Record<string, string>;
  cache?: RequestCache;
}

export const proxy = async <T = unknown>(
  path: string,
  opts: ProxyOptions = {}
): Promise<{ status: number; data: T | { error: string } }> => {
  const init: RequestInit = {
    method: opts.method || 'GET',
    headers: { ...(opts.headers || {}) },
    cache: opts.cache ?? 'no-store',
  };
  if (opts.formData) {
    init.body = opts.formData;
  } else if (opts.body !== undefined) {
    init.headers = { 'Content-Type': 'application/json', ...init.headers };
    init.body = JSON.stringify(opts.body);
  }
  try {
    const res = await fetch(flaskUrl(path), init);
    const text = await res.text();
    let data: T | { error: string };
    try {
      data = text ? (JSON.parse(text) as T) : ({} as T);
    } catch {
      data = { error: text || 'Invalid backend response' };
    }
    return { status: res.status, data };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return { status: 502, data: { error: `Backend unreachable: ${message}` } };
  }
};
