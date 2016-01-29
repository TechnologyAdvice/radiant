Radiant
=======
Semantic UI theme for internal TechnolgoyAdvice apps.

See [learn semantic](http://learnsemantic.com/) for understanding this project.

**[Demo](http://technologyadvice.github.io/radiant/)**

## Development
`npm start` - Installs dependencies and runs gulp.

`gulp` - Sets up everything needed for development, see the task for details.  
`gulp help` - List gulp commands and help.


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
