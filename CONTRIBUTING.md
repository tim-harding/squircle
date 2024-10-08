# Contributing

Clone the repo and install dependencies.

```sh
git clone git@github.com:tim-harding/squircle.git
cd squircle
npm install
```

## Library

To serve a test page:

```sh
npm run dev
```

To build the library for production:

```sh
npm run build
```

To publish the library to NPM:

```sh
./publish.sh
```

### Publish

```sh
cd package
npm publish
cd ..
```

## GitHub Pages demo

The GitHub Actions workflow automatically builds and deploys the site after
pushing to `main`. To serve the website for local development, use

```sh
npm run pages-dev
```
