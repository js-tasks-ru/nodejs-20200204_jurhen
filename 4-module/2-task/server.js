const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

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
    case 'POST':
      fs.access(filepath, fs.constants.F_OK, (err) => {
        if (!err) {
          res.writeHead(409);
          res.end('File already exists');
          return;
        }

        const writeStream = fs.createWriteStream(filepath);
        const limitedStream = new LimitSizeStream({ limit: 1024 * 1024 });

        req.on('aborted', () => {
          writeStream.destroy();
          fs.unlink(filepath, (err) => {
            if (err) throw new Error();
          });
        });

        limitedStream.on('error', (err) => {
          writeStream.destroy();
          fs.unlink(filepath, (err) => {
            if (err) throw new Error();
          });
          res.writeHead(413);
          res.end('File is too big');
        });

        writeStream.on('error', (err) => {
          res.writeHead(500);
          res.end('500 error');
        });

        writeStream.on('finish', () => {
          res.writeHead(200);
          res.end('Successfull!');
        });
      });

      req.pipe(limitStream).pipe(writeStream);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
