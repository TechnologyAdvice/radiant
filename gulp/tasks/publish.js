var g = require('gulp-load-plugins')();
var gulp = g.help(require('gulp'), require('../gulphelp'));
var runSequence = require('run-sequence');
var paths = require('../paths');
var pkg = require('../../package.json');

gulp.task('publish', 'publish theme to cdn', function(cb) {
  var AWS_ACCESS_KEY_ID = process.env.RADIANT_AWS_ACCESS_KEY_ID;
  var AWS_SECRET_ACCESS_KEY = process.env.RADIANT_AWS_SECRET_ACCESS_KEY;

  if (!AWS_ACCESS_KEY_ID) {
    throw new Error('Missing RADIANT_AWS_ACCESS_KEY_ID. See README.md');
  }

  if (!AWS_SECRET_ACCESS_KEY) {
    throw new Error('Missing RADIANT_AWS_SECRET_ACCESS_KEY. See README.md');
  }

  var publisher = g.awspublish.create({
    params: {
      Bucket: 'ta-radiant-assets'
    },
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  });

  var headers = {};

  return gulp.src(paths.dist + '/**/*')
    // prefix S3 objects with package.json version number 
    .pipe(g.rename(function(path) {
      path.dirname = '/' + pkg.version + '/' + path.dirname;
    }))

    .pipe(g.debug())

    // gzip, Set Content-Encoding headers and add .gz extension 
    .pipe(g.awspublish.gzip({ext: '.gz'}))

    // publisher will add Content-Length, Content-Type and headers specified
    // above. If not specified it will set x-amz-acl to public-read by default.
    .pipe(publisher.publish(headers))

    // create a cache file to speed up consecutive uploads 
    //.pipe(publisher.cache())

    // print upload updates to console 
    .pipe(g.awspublish.reporter());
});
