const Http = require('http');
const fs = require('fs');

// Server
Http.createServer((req, res) => {
  let pathname = '.' + req.url;
  let data = '';
  req.on('data', d => {
    data += d;
  });
  req.on('end', () => {
    console.log(pathname);
    fs.readFile(pathname === './' ? './canvas-text.html' : pathname, (err, data) => {
      if (err) {
        res.end('error');
      } else res.end(data.toString());
    });
  });
}).listen(3000, () => {
  console.log(`Server on 3000`);
});
