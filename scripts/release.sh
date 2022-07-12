#!/usr/bin/env bash

npm run build
cp package.json ./dist
cp README.md ./dist
cd ./dist
npm publish