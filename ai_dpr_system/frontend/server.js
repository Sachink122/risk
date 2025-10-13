// Basic server script to run Next.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

// Log the current directory to verify where we are
console.log('Current directory:', __dirname);
console.log('App directory exists:', require('fs').existsSync(path.join(__dirname, 'app')));

// Force development mode
process.env.NODE_ENV = 'development';

// Configure Next.js with the correct directory
const app = next({ 
  dev: true,
  dir: __dirname
});

const handle = app.getRequestHandler();

// Use port 3001 instead of 3000
const PORT = 3001;

app.prepare().then(() => {
  console.log('Next.js app prepared successfully!');
  
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Error preparing Next.js app:', err);
  process.exit(1);
});