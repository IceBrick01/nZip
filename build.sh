#!/bin/sh

rm -rf dist

bun install
bun run build

cp package.json dist

cp -r App dist
rm -rf dist/App/Pages