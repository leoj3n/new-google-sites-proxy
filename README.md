# New Google Sites Proxy

NodeJS proxy for the [New Google Sites](https://sites.google.com/new).

## Quick Start

### Certificates

If you haven't generated any local certificates yet, you can use [`mkcert`](https://github.com/FiloSottile/mkcert).

Edit `config/development.js` or update the symlinks in the `ssl` folder to point to your local key/cert files.

### Installing

Next, in a terminal at the root of the repo, run:

```console
npm install
```

Once the install has finished, run the server:

```console
npm start
```

### Visiting

Visit <https://localhost:3000/view/new-sites-demo> to see the proxy site.

To see a more complex demo, try <https://localhost:3000/lexnetcrm.com/new-sites-demo>.

For your own site URL, simply replace <https://sites.google.com> with <https://localhost:3000>.

### Injecting

Edit `index.js` to inject scripts from the `public` folder. Restart the server.

## npm run

### Development

```console
npm install
npm start
npm run lint
```

### Everything

```console
Lifecycle scripts included in new-google-sites-proxy:
  start
    node ${npm_package_main}
  test
    echo "Error: no test specified" && exit 1

available via `npm run-script`:
  lint
    npm run prettier-multi && npm run prettier-pkg
  prettier-multi
    prettier --single-quote --trailing-comma es5 --write '**/*.{js,json,md,less}'
  prettier-pkg
    prettier-package-json --write package.json
```

## Deploy

You will need to purchase a valid SSL certificate or use <https://letsencrypt.org/>.

### Heroku

If you're using Heroku, SSL is automatically provided by their public host.

You will need to update `host` in `config/production.json`.
