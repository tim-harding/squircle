mkdir -p package
cp src/* package/
sed 's/"private": true/"private": false/g' package.json > package/package.json

