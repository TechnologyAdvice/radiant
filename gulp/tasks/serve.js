const g = require('gulp-load-plugins')()
const gulp = g.help(require('gulp'), require('../gulphelp'))
const paths = require('../paths')

gulp.task('serve', 'start the dev server with livereload', function() {
  return gulp.src(paths.docsDist)
    .pipe(g.webserver({
      host: 'localhost',
      port: 8080,
      open: true,
      livereload: true,
    }))
})
