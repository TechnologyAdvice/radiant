#!/usr/bin/env bash

#
# configure git
#
git config --global user.name "tadeploy"
git config --global user.email "devteam@technologyadvice.com"

#
# build
#
$(npm bin)/gulp build
$(npm bin)/gulp docs

#
# generate changelog
#
echo "...installing github changelog generator"
gem install github_changelog_generator
echo "...generating changelog"
github_changelog_generator $CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME

#
# push to master and gh-pages
#
git add .

if [[ -n $(git status --porcelain) ]]; then
  echo "...starting push, repo is dirty after build"
  git commit -n -m "deploy commit by $CIRCLE_USERNAME"
  git push origin master
  git push -f origin master:gh-pages
else
  echo "...skipping push, repo is clean after build"
fi

#
# s3 sync
#
echo "...installing awscli"
sudo pip install awscli

echo "...syncing with s3"
BUCKET=ta-radiant-assets
DIRECTORY=./dist
NPM_PACKAGE_VERSION=$(json -f package.json version)

aws s3 sync ${DIRECTORY} s3://${BUCKET}/${NPM_PACKAGE_VERSION}/ --delete