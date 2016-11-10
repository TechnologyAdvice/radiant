const g = require('gulp-load-plugins')()
const gulp = g.help(require('gulp'), require('../gulphelp'))
const del = require('del')
const runSequence = require('run-sequence')
const paths = require('../paths')

gulp.task('docs', 'build the /docs page', function(cb) {
  runSequence(
    [
      'build',
      'clean-docs-dist',
    ],
    [
      'docs-copy-dist-build',
      'docs-less',
      'docs-html'
    ],
    cb
  )
})

gulp.task('clean-docs-dist', function(cb) {
  del.sync(paths.docsDist)
  cb()
})

gulp.task('docs-less', function(cb) {
  return gulp.src(paths.docsSrc + '/*.less')
    .pipe(g.plumber())
    .pipe(g.cached('doc-less'))
    .pipe(g.less())
    .pipe(g.autoprefixer())
    .pipe(g.remember('doc-less'))
    .pipe(g.concatCss('doc-overrides.css'))
    .pipe(gulp.dest(paths.docsDist))
})

gulp.task('docs-html', function(cb) {
  return gulp.src(paths.docsSrc + '/*.html')
    .pipe(gulp.dest(paths.docsDist))
})

gulp.task('docs-copy-dist-build', function(cb) {
  return gulp.src(paths.dist + '/**')
    .pipe(gulp.dest(paths.docsDist))
})
