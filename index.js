const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const https = require('https');
const express = require('express');
const proxy = require('http-proxy-middleware');
const logger = require('http-proxy-middleware/lib/logger').getInstance();

const config = {
  port: 3000,
  logLevel: 'debug',
  domain: 'https://sites.google.com',
  cert: fs.readFileSync(path.resolve('./ssl/cert.pem')),
  key: fs.readFileSync(path.resolve('./ssl/key.pem')),
};

const replace = function(body, req) {
  const needle = `,"${config.domain}${req.url}",`;

  if (req.method === 'POST') {
    return body;
  } else {
    logger.debug('[GSP] Replace:', needle);
    return body.replace(needle, ',null,');
  }
};

const inject = function(body, src) {
  logger.debug('[GSP] Inject:', src);
  return body.replace('</head>', `<script src="${src}"></script></head>`);
};

const filter = function(pathname, req) {
  const match = !!pathname.match('^/');
  logger.debug('[GSP] Filter:', req.method, pathname, match);
  return match;
};

const onProxyRes = function(proxyRes, req, res) {
  let buffer = Buffer.from([]);

  proxyRes.on('data', data => {
    buffer = Buffer.concat([buffer, data]);
  });

  proxyRes.on('end', () => {
    let body = zlib.gunzipSync(buffer).toString('utf8');

    body = replace(body, req);
    body = inject(body, '/remove-footer.js');

    res.set({
      'content-encoding': 'gzip',
      'content-type': 'text/html; charset=utf-8',
    });

    res.write(zlib.gzipSync(body));

    res.end();
  });

  delete proxyRes.headers['x-frame-options'];
  delete proxyRes.headers['content-security-policy'];
};

var domainProxy = proxy(filter, {
  changeOrigin: true,
  target: config.domain,
  onProxyRes: onProxyRes,
  selfHandleResponse: true,
  logLevel: config.logLevel,
});

const app = express();
app.use(express.static('public'));
app.use('/', domainProxy);

https
  .createServer(
    {
      key: config.key,
      cert: config.cert,
    },
    app
  )
  .listen(config.port, () => {
    logger.info(`[GSP] Server: https://localhost:${config.port}`);
  });
