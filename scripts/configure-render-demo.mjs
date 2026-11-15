import { writeFileSync } from 'node:fs';

const value = process.env.KINEMO_PUBLIC_API_BASE?.trim();
let springDemoApi = '';
if (value) {
  const url = new URL(value);
  const loopback = ['localhost', '127.0.0.1'].includes(url.hostname);
  if ((url.protocol !== 'https:' && !(loopback && url.protocol === 'http:'))
    || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('KINEMO_PUBLIC_API_BASE debe ser el origen HTTPS de la API, sin ruta.');
  }
  springDemoApi = url.origin;
}
writeFileSync(new URL('../public/kinemo-runtime.json', import.meta.url),
  JSON.stringify({ springDemoApi }) + '\n');
