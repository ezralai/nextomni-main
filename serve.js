/**
 * Zero-Dependency Local Static Server for NextOmni Master Portal
 * Usage: node serve.js [port]
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || process.argv[2] || '5000', 10);
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // API Route: Standardized Master Health Probe
  if (urlPath === '/api/v1/health' || urlPath === '/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });
    const mem = process.memoryUsage();
    return res.end(JSON.stringify({
      status: 'healthy',
      module: 'NextOmni Master Portal',
      author: 'Ezra Lai',
      role: 'Principal Systems Architect & Cognitive Engineer',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      observability: {
        memoryHeapUsedMB: Number((mem.heapUsed / 1024 / 1024).toFixed(2)),
        memoryHeapTotalMB: Number((mem.heapTotal / 1024 / 1024).toFixed(2)),
        nodeVersion: process.version
      },
      pillars: [
        { id: 'finance', name: 'NextOmni Finance', stack: 'Laravel 11 REST / Nuxt 3 / Postgres 16', defaultPort: 3002 },
        { id: 'life', name: 'NextOmni Life', stack: 'Next.js 15 / FastAPI / Web Audio', defaultPort: 3000 },
        { id: 'study', name: 'NextOmni Study', stack: 'Next.js 15 / FSRS-4.5 / GPA Engine', defaultPort: 3001 },
        { id: 'intelligence', name: 'NextOmni Intelligence', stack: 'Python ML / FastAPI / Quarto', defaultPort: 8000 }
      ],
      cloudArchitecture: {
        tier: '100% Free-Tier Production Cloud ($0/month)',
        zeroMockupsGuaranteed: true
      }
    }, null, 2));
  }

  // Normalize URL and prevent directory traversal
  let safePath = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(ROOT_DIR, safePath);

  // Security check: ensure path stays within ROOT_DIR
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 Not Found: ${safePath}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n================================================================`);
  console.log(`  NEXTOMNI ECOSYSTEM MASTER PORTAL`);
  console.log(`  Author: Ezra Lai | Production OS Architecture`);
  console.log(`  Server live at: http://localhost:${PORT}`);
  console.log(`================================================================\n`);
});
