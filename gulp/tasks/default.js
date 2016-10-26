const g = require('gulp-load-plugins')()
const gulp = g.help(require('gulp'), require('../gulphelp'))
const runSequence = require('run-sequence')

gulp.task('default', 'build, docs, serve, watch', function(cb) {
  runSequence(
    'build',
    'docs',
    [
      'serve',
      'watch',
    ],
    cb
  )
})
