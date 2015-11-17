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

```
  $ npm run update-semantic
```

## Deploying

### Setup

**Get your AWS keys**

1. Sign into the [AWS console](https://technologyadvice.signin.aws.amazon.com/console)
1. Go to the IAM (Identity and Access Management) service.
1. Click on Users in the left nav, then your user
1. Scroll to Security Credentials and click Create Access Key
1. Download or copy the secret key, you will not have access to it again.

**Add Environment Variables**
Set environment variables in your dotfile (.profile, .bash_profile, etc)
```terminal
export RADIANT_AWS_ACCESS_KEY_ID=<access_key_id>
export RADIANT_AWS_SECRET_ACCESS_KEY=<secret_access_key>
```

### Usage

After merging a new feature into master:

```
gulp deploy -v <major|minor|patch|premajor|preminor|prepatch|prerelease> [-m <commit message>]
```

- Creates a fresh build
- Bumps the version number specified with `-v`
- Creates a tag
- Pushes the fresh build and tag
- Uploads the build to S3 under the new version number
