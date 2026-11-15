import { writeFileSync } from 'node:fs';

function configuredOrigin(name) {
  const value = process.env[name]?.trim();
  if (!value) return '';

  const url = new URL(value);
  const loopback = ['localhost', '127.0.0.1'].includes(url.hostname);
  if ((url.protocol !== 'https:' && !(loopback && url.protocol === 'http:'))
    || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error(name + ' debe ser el origen HTTPS de la API, sin ruta.');
  }
  return url.origin;
}

const springDemoApi = configuredOrigin('KINEMO_PUBLIC_API_BASE');
const evaluationApi = configuredOrigin('KINEMO_EVALUATION_API_BASE');
writeFileSync(new URL('../public/kinemo-runtime.json', import.meta.url),
  JSON.stringify({ springDemoApi, evaluationApi }) + '\n');
