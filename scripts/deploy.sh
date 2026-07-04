#!/bin/zsh
# Build and publish the app to GitHub Pages (gh-pages branch).
set -e
cd "$(dirname "$0")/.."
npx vite build
cd dist
touch .nojekyll
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy Wellhub replica"
git push -q -f https://github.com/kenil042288/wellhub-replica.git gh-pages
cd ..
rm -rf dist/.git
echo "Deployed: https://kenil042288.github.io/wellhub-replica/"
