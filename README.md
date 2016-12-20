# [Radiant](http://technologyadvice.github.io/radiant/)
[![Circle CI](https://img.shields.io/circleci/token/70267ce4ea6c3511e3ae7f82b9acaf075e4d2e7c/project/TechnologyAdvice/radiant/master.svg?style=flat-square)](https://circleci.com/gh/TechnologyAdvice/radiant/tree/master)

Semantic UI theme for internal TechnolgoyAdvice apps.

## Install

**NPM**

```
npm i @technologyadvice/radiant -S
```

**CDN**

```
cdn.taplatform.net/radiant/x.x.x/css/radiant.min.css
```

## Usage

See [learn semantic](http://learnsemantic.com/) for understanding this project.

## Development

```
npm start             # build, watch, and serve docs
npm build             # build the theme
npm build:docs        # build the docs
```


## Getting Started

See the [Semantic UI Customizing](http://learnsemantic.com/developing/customizing.html) docs.

Then checkout the Semantic UI guidelines on our [wiki](https://github.com/TechnologyAdvice/TAPAnsible/wiki/).

## Updating Semantic

This project uses a custom build.  **Do not** use Semantic UI's build or update. You will hose this project.

    npm run update-semantic

### Releasing

On the latest clean `master`:

    npm run release:major
    npm run release:minor
    npm run release:patch
