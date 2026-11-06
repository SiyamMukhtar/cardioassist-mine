// Single Vercel Function for CardioAssist API routes.
// The explicit rewrite forwards /api/* here and preserves the path
// in __ca_path so Express can match its normal /api routes.
import app from '../server/index.js';

export default function handler(req, res) {
  const path = req.query?.__ca_path;
  if (typeof path === 'string') {
    const originalUrl = new URL(req.url || '/', 'http://localhost');
    originalUrl.searchParams.delete('__ca_path');
    const rest = originalUrl.searchParams.toString();
    req.url = '/api/' + path.replace(/^\/+/, '') + (rest ? '?' + rest : '');
  } else if (Array.isArray(path)) {
    req.url = '/api/' + path.map(encodeURIComponent).join('/');
  }
  return app(req, res);
}
