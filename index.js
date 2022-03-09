import { createServer } from "https";
import * as fs from "fs/promises";
import * as path from "path";

const mimeTypes = JSON.parse((await fs.readFile('./mime-types.json')).toString());
const inaccessible = JSON.parse((await fs.readFile('./inaccessible.json')).toString());

const server = createServer({
  key: (await fs.readFile('./server.key')),
  cert: (await fs.readFile('./server.cert')),
}, async function (req, res) {
  console.log('request ', req.url);

  let filePath = '.' + req.url;
  if (filePath.endsWith('./')) {
    filePath += './index.html';
  }

  const extension = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extension] ?? 'application/octet-stream';
  if (inaccessible.includes(filePath)) {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'Content-length': (await fs.stat('./404.html')).size
    });
    const file = await fs.open('./404.html');
    file.createReadStream().pipe(res);
  }
  try {
    const file = await fs.open(filePath);
    res.writeHead(200, {
      'Content-type': contentType,
      'Content-length': (await fs.stat(filePath)).size
    });
    file.createReadStream().pipe(res);
  } catch (e) {
    console.log(e.code);
    if (e.code === "ENOENT") {
      res.writeHead(404, {
        'Content-type': 'text/html',
        'Content-length': (await fs.stat('./404.html')).size
      });
      const file = await fs.open('./404.html');
      file.createReadStream().pipe(res);
    }
  }
});

server.listen(500, function () {
  console.log("listening on 500");
});