const zlib = require('zlib');
const https = require('https');
const config = require('config');
const express = require('express');
const isHeroku = require('is-heroku');
const proxy = require('http-proxy-middleware');
const logger = require('http-proxy-middleware/lib/logger').getInstance();

const onListen = function() {
  logger.info(
    `[GSP] Server: https://${config.get('host')}:${config.get('port')}`
  );
};

const noContent = function(req, res) {
  logger.debug('[GSP] No Content:', req.method, req.url);
  res.sendStatus(204);
};

const replace = function(body, req) {
  const needle = `,"${config.get('target')}${req.url}",`;
  logger.debug('[GSP] Replace:', needle);
  return body.replace(needle, ',null,');
};

const injectHead = function(body, src) {
  const tag = '</head>';
  return src.reduce((acc, cur) => {
    logger.debug(`[GSP] Inject ${tag}:`, cur);
    return acc.replace(
      tag,
      `<link rel="stylesheet" href="/styles/${cur}"/>${tag}`
    );
  }, body);
};

const injectBody = function(body, src) {
  const tag = '</body>';
  return src.reduce((acc, cur) => {
    logger.debug(`[GSP] Inject ${tag}:`, cur);
    return acc.replace(tag, `<script src="/scripts/${cur}"></script>${tag}`);
  }, body);
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

    if (req.method === 'GET') {
      body = replace(body, req);
      body = injectHead(body, config.get('inject.styles'));
      body = injectBody(body, config.get('inject.scripts'));
    }

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

var targetProxy = proxy(filter, {
  changeOrigin: true,
  onProxyRes: onProxyRes,
  selfHandleResponse: true,
  target: config.get('target'),
  logLevel: config.get('log'),
});

const app = express();

app
  .use(express.static(config.get('public')))
  .use('/u/', noContent)
  .use('/', targetProxy);

if (isHeroku) {
  app.listen(config.get('port'), onListen);
} else {
  https
    .createServer(
      {
        key: config.get('key'),
        cert: config.get('cert'),
      },
      app
    )
    .listen(config.get('port'), onListen);
}
