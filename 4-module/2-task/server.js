const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  let errorCreateFile = false;
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const writeStream = fs.createWriteStream(filepath, {
    flags: 'wx',
  });

  writeStream.on('error', (err) => {
    errorCreateFile = true;
    console.log('Error create file!');
    res.writeHead(409);
    res.end('File already exists');
    return;
  });

  if (pathname.includes('/')) {
    res.writeHead(400);
    res.end('Bad request');
    return;
  }

  switch (req.method) {
    case 'POST':
      const limitStream = new LimitSizeStream({ limit: 1024 * 1024 });

      req.on('aborted', () => {
        fs.unlink(filepath, (err) => {
          if (err) throw new Error(err);
        });
      });

      limitStream.on('error', (err) => {
        fs.unlink(filepath, (err) => {
          errorCreateFile = true;
          if (err) throw err;
          console.log('File is too big!');
          res.writeHead(413);
          res.end('File is too big!');
          return;
        });
      });

      writeStream.on('close', () => {
        if (!errorCreateFile) {
          console.log('close');
          res.writeHead(200);
          res.end('sucessfull!');
        }
      });

      req.pipe(limitStream).pipe(writeStream);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
