# New Google Sites Proxy

NodeJS proxy for the [New Google Sites](https://sites.google.com/new).

Removes the `<footer>` by default.

## Quick Start

### Certificates

If you haven't generated any local certificates yet, you can use [`mkcert`](https://github.com/FiloSottile/mkcert).

Edit `config/development.js` or update the symlinks in the `ssl` folder to point to your local key/cert files.

### Installing

In a terminal at the root of the repo, run:

```console
npm install
```

Once the install has finished, run the server:

```console
npm start
```

### Visiting

Visit <https://localhost:3000/view/new-sites-demo> to see a proxy site.

For a more complex demo, try <https://localhost:3000/lexnetcrm.com/new-sites-demo>.

To see your own site, simply replace <https://sites.google.com> with <https://localhost:3000>.

### Injecting

Edit `inject.styles` and `inject.scripts` in `config/default.json` to control what is injected.

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

If deploying to Heroku, SSL is automatically terminated at their public host.

All you need to do is update `host` in `config/production.json` to point to your instance.
