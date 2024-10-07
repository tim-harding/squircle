mkdir -p build
rm -f build/*
cp README.md build/
cp src/* build/
sed 's/"private": true/"private": false/g' package.json > build/package.json
npx tsc --project tsconfig.build.json
npx rollup src/index.mjs | npx uglifyjs --compress --mangle --module > build/index.min.js
npx rollup src/worklet.mjs | npx uglifyjs --compress --mangle > build/worklet.min.js
