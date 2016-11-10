const g = require('gulp-load-plugins')()
const gulp = g.help(require('gulp'), require('../gulphelp'))
const del = require('del')
const runSequence = require('run-sequence')
const paths = require('../paths')
const getSemanticLessFile = require('../plugins/getSemanticLessFile')
const _ = require('lodash')

const minifyOpts = { keepSpecialComments: 0 }

gulp.task('build', 'build the theme and doc page', function(cb) {
  runSequence(
    'clean-build',
    [
      'build-assets',
      'build-cached-less'
    ],
    cb
  )
})

gulp.task('clean-build', function(cb) {
  del.sync(paths.dist)
  cb()
})

gulp.task('build-assets', function() {
  return gulp.src(paths.assetFiles)
  // do not cache since docs rebuilds during watch
  // this will del() dist then rebuild, but assets didn't change
  // so they are never re-built after the first watch/rebuild cycle
    .pipe(gulp.dest(paths.dist))
})

function buildLess({ src, cached }) {
  return gulp.src(src)
    .pipe(g.plumber())                          // don't kill watchers on error
    .pipe(g.if(cached, g.cached('less')))       // only pass files changed since last build
    .pipe(getSemanticLessFile())                // for *.variables/overrides use the *.less
    .pipe(g.less())                             // compile to css
    .pipe(g.if(cached, g.remember('less')))     // add back files that didn't change
    .pipe(g.concatCss('radiant.css'))           // concat all css files
    .pipe(g.autoprefixer())                     // autoprefix for browser support
    .pipe(gulp.dest(paths.dist + '/css'))       // put in dist
    .pipe(g.minifyCss(minifyOpts))              // minify the build
    .pipe(g.rename('radiant.min.css'))          // rename
    .pipe(gulp.dest(paths.dist + '/css'))       // put that in dist also
}

gulp.task('build-cached-less', function() {
  return buildLess({
    cached: true,
    src: [
      ...paths.lessFiles,

      // .variables and .overrides are replaced with their corresponding .less
      //  definition file during build. We add them so they are watched and
      // trigger rebuilds of their corresponding less files.
      ...paths.componentVariables,
      ...paths.componentOverrides,
    ],
  })
})

gulp.task('build-all-less', function(cb) {
  g.util.log(g.util.colors.yellow('rebuilding all less'))

  return buildLess({
    cached: false,
    src: paths.lessFiles,
  })
})
