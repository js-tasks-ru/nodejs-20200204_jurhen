const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  if (pathname === 'favicon.ico') return;

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/')) {
    res.writeHead(400);
    res.end('Bad request');
    return;
  }

  fs.stat(filepath, (err, stat) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }

    const readStream = fs.createReadStream(filepath);

    switch (req.method) {
      case 'GET':
        res.writeHead(200);
        readStream.pipe(res);
        break;

      default:
        res.statusCode = 501;
        res.end('Not implemented');
    }
  });
});

module.exports = server;
