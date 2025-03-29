#!/bin/sh

rm -rf dist

bun install
bun run bundle
bun run build

cp .npmrc dist
cp package.json dist
cp start.sh dist

cp -r App dist
rm -rf dist/App/Pages
