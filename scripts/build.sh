mkdir -p package
rm package/*
cp README.md package/
cp src/index.css package/
cp src/index.mjs package/
node_modules/uglify-js/bin/uglifyjs --compress --mangle -- src/worklet.mjs > package/worklet.min.js
sed 's/"private": true/"private": false/g' package.json > package/package.json
cp tsconfig.build.json package/tsconfig.json
cd package
../node_modules/typescript/bin/tsc --build
cd ..
rm package/tsconfig.json
rm package/tsconfig.tsbuildinfo
