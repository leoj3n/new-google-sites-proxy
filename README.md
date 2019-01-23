# New Google Sites Proxy

NodeJS proxy for the [New Google Sites](https://sites.google.com/new).

## Quick Start

In any terminal, at the root of the repo:

```console
npm install
```

Once the install has finished, run the server:

```console
npm start
```

Visit <http://localhost:3000/view/<yoursitename>> to see the proxy site.

### Injecting Scripts

Edit `index.js` to inject scripts from the `public` folder. Restart the server.

## npm run

Development:

```console
npm install
npm start
npm run lint
```

Everything:

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
