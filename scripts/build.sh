mkdir -p build
rm -f build/*
cp README.md build/
cp src/* build/
sed 's/"private": true/"private": false/g' package.json > build/package.json
npx tsc --project tsconfig.build.json
npx rollup src/worklet.mjs | npx uglifyjs --compress --mangle --mangle-props > build/worklet.min.js
