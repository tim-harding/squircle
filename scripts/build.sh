rm package/*
mkdir -p package
cp src/index.css package/
cp src/index.mjs package/
node_modules/uglify-js/bin/uglifyjs --compress --mangle -- src/worklet.mjs > package/worklet.min.js
sed 's/"private": true/"private": false/g' package.json > package/package.json

