#!/usr/bin/env sh

set -e
npm run build
cat package.json | jq "del (.private)" > dist/package.json
cd dist
npm publish
cd -
