// Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
const comments = require('./comments.json');
const PORT = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const parsedQuery = querystring.parse(parsedUrl.query);
  const pathname = parsedUrl.pathname;

  if (req.method === 'GET') {
    if (pathname === '/') {
      fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
        if (err) {
          res.statusCode = 404;
          res.end('Not found');
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          res.end(data);
        }
      });
    } else if (pathname === '/comments') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(comments));
    } else {
      res.statusCode = 404;
      res.end('Not found');
    }
  } else if (req.method === 'POST') {
    if (pathname === '/comments') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const comment = querystring.parse(body);
        comments.push(comment);
        fs.writeFile(
          path.join(__dirname, 'comments.json'),
          JSON.stringify(comments),
          'utf8',
          (err) => {
            if (err) {
              res.statusCode = 500;
              res.end('Internal Server Error');
            } else {
              res.statusCode = 201;
              res.end(JSON.stringify(comment));
            }
          }
        );
      });
    } else {
      res.statusCode = 404;
      res.end('Not found');
    }
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});