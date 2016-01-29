#!/usr/bin/env bash

NPM_PACKAGE_VERSION=$(json -f package.json version)

# configure git
git config --global user.name "tadeploy"
git config --global user.email "devteam@technologyadvice.com"

# generate changelog
echo "...generating changelog"
ta-script circle_ci/create_changelog

# gh-pages
gulp build docs
git add .

if [[ -n $(git status --porcelain) ]]; then
  echo "...starting push, repo is dirty after build"
  git commit -n -m "deploy commit by $CIRCLE_USERNAME [ci skip]"
  git push origin master
  git push -f origin master:gh-pages
else
  echo "...skipping push, repo is clean after build"
fi

# s3 sync
echo "...syncing with s3"
ta-script aws/s3_sync -d ./dist -b ta-radiant-assets/${NPM_PACKAGE_VERSION}
