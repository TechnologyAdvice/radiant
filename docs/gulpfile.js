var gulp = require('gulp');
var runSequence = require('run-sequence');
var g = require('gulp-load-plugins')();

var paths = {
  root: __dirname + '/',
  dist: __dirname + '/../ui/dist/'
};

gulp.task('less', function () {
  return gulp.src(paths.root + 'doc-overrides.less')
    .pipe(g.less())
    .pipe(gulp.dest(paths.dist));
});

//
// Watch
//

gulp.task('watch', function(cb) {
  console.log(paths.root);
  runSequence(
    [
      'watch-less'
    ],
    cb
  )
});

gulp.task('watch-less', function () {
  return gulp.watch([
    paths.root + '**/*.less'
    ], ['less']);
});
