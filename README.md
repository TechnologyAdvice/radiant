# Radiant
A theme build out of Semantic-UI named Radiant.

Install
------
```
npm i
cd ui
gulp build
```
Run `gulp` to watch files for changes

Getting Started
------
To customize and update the Radiant theme variables, add to or edit `./ui/site/globals/site.variables`

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
