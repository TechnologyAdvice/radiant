Radiant
=======
A theme build out of Semantic-UI named Radiant.

## Development
`npm start` - Installs dependencies and runs gulp.

`gulp` - Sets up everything needed for development, see the task for details.  
`gulp help` - List gulp commands and help.


## Getting Started
To customize and update the Radiant theme variables, add to or edit `src/site/globals/site.variables`

Use all files ending in `.variables` to add or adjust existing UI Variables:
```less
/* Adjusting @borderColor actually modifies a ton of other variables */
@shadowBoxShadow: 0px -@shadowDistance 0px 0px @borderColor inset;
@borderBoxShadow: 0px 0px 0px @borderBoxShadowWidth @borderBoxShadowColor inset;
@boxShadow:
  @borderBoxShadow,
  @shadowBoxShadow
;
@downBoxShadow:
  @borderBoxShadow,
  0px 1px 4px 0px @borderColor inset !important
;
@basicBoxShadow: 0px 0px 0px @basicBorderSize @borderColor inset;
```

Use all files ending in `.overrides` to adjust page specific styles to override library defaults:
```css
#profile .user .image {
  margin-right: 3em;
}
#promo .page.grid > h1 {
  font-size: 3em;
}
#faq .unusual.segment {
  border-top-color: #009FDA;
}
```

## Updating Semantic
This project uses a custom build.  **Do not** use Semantic's build or update.
You will hose this project.

Semantic's file structure and paradigms were preserved.  Updating means you
update the default theme and the definitions.

1. Get the latest Semantic files
1. Overwrite `src/themes/default/*` with the latest
1. Overwrite `src/definitions/*` with the latest
1. Overwrite `src/{semantic.less, theme.less, theme.config}` with the latest
1. Run a build.

Done.

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
