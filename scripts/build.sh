mkdir -p package
rm package/*
cp README.md package/
cp src/index.css package/
sed 's/"private": true/"private": false/g' package.json > package/package.json
node_modules/uglify-js/bin/uglifyjs --compress --mangle -- src/worklet.mjs > package/worklet.min.js
node_modules/uglify-js/bin/uglifyjs --compress --mangle -- src/index.mjs > package/index.min.js

cp tsconfig.build.json package/tsconfig.json
cd package
../node_modules/typescript/bin/tsc --build
rm tsconfig.json tsconfig.tsbuildinfo
cd ..
