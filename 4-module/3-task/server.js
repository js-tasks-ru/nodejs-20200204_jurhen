const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/')) {
    res.writeHead(400);
    res.end('Bad request');
    return;
  }

  switch (req.method) {
    case 'DELETE':
      fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err || req.url === '/') {
          res.writeHead(404);
          res.end('Not available');
          return;
        }

        res.on('error', (err) => {
          res.writeHead(500);
          res.end(err);
        });

        fs.unlink(filepath, (err) => {
          if (err) throw new Error();
          res.writeHead(200);
          res.end('successfull deleted');
        });
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
