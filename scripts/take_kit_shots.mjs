import http from 'http';
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const dist = path.resolve('frontend/dist');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let p = req.url.split('?')[0].split('#')[0];
  let f = path.join(dist, p === '/' ? 'index.html' : p);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(dist, 'index.html');
  const ext = path.extname(f);
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': 'no-store'
  });
  fs.createReadStream(f).pipe(res);
});

const PORT = 5392;
const artifactDir = '/Users/annmaria/.gemini/antigravity/brain/881a9347-ab80-414a-b09b-c8dadf97fb10';
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Server listening at http://127.0.0.1:${PORT}`);

  try {
    // 1. Light Mode Full Page (390px)
    const lightFull = path.join(artifactDir, 'kit_390px_light_full.png');
    console.log('Capturing Light Mode Full (390x2600)...');
    execFileSync(chromePath, [
      '--headless=new',
      '--screenshot=' + lightFull,
      '--window-size=390,2600',
      '--hide-scrollbars',
      '--virtual-time-budget=2000',
      `http://127.0.0.1:${PORT}/#kit`
    ], { stdio: 'inherit' });
    console.log(`Captured: ${lightFull}`);

    // 2. Light Mode Screen Viewport (390x844)
    const lightHero = path.join(artifactDir, 'kit_390px_light_hero.png');
    console.log('Capturing Light Mode Hero (390x844)...');
    execFileSync(chromePath, [
      '--headless=new',
      '--screenshot=' + lightHero,
      '--window-size=390,844',
      '--hide-scrollbars',
      '--virtual-time-budget=2000',
      `http://127.0.0.1:${PORT}/#kit`
    ], { stdio: 'inherit' });
    console.log(`Captured: ${lightHero}`);

    // 3. Dark Mode Full Page (390px)
    const darkFull = path.join(artifactDir, 'kit_390px_dark_full.png');
    console.log('Capturing Dark Mode Full (390x2600)...');
    execFileSync(chromePath, [
      '--headless=new',
      '--screenshot=' + darkFull,
      '--window-size=390,2600',
      '--hide-scrollbars',
      '--virtual-time-budget=2000',
      `http://127.0.0.1:${PORT}/#kit?dark`
    ], { stdio: 'inherit' });
    console.log(`Captured: ${darkFull}`);

    // 4. Dark Mode Screen Viewport (390x844)
    const darkHero = path.join(artifactDir, 'kit_390px_dark_hero.png');
    console.log('Capturing Dark Mode Hero (390x844)...');
    execFileSync(chromePath, [
      '--headless=new',
      '--screenshot=' + darkHero,
      '--window-size=390,844',
      '--hide-scrollbars',
      '--virtual-time-budget=2000',
      `http://127.0.0.1:${PORT}/#kit?dark`
    ], { stdio: 'inherit' });
    console.log(`Captured: ${darkHero}`);

  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    server.close();
    console.log('All screenshots captured successfully!');
  }
});
