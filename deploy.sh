#!/bin/bash
# Deploy script for GitHub Pages
# This copies the built files from dist/ to the root for GitHub Pages

echo "Building production bundle..."
npm run build

echo "Copying built files to root..."
cp dist/index.html ./
cp -r dist/assets ./
cp dist/manifest.webmanifest ./
cp dist/registerSW.js ./
cp dist/sw.js ./
cp dist/workbox-*.js ./
cp dist/menu.json ./data/menu.json

echo "✅ Deploy complete! Commit and push to deploy to GitHub Pages."
