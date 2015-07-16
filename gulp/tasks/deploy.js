var _ = require('lodash');
var argv = require('minimist')(process.argv.slice(2));
var exec = require('child_process').exec;
var g = require('gulp-load-plugins')();
var gulp = g.help(require('gulp'), require('../gulphelp'));
var paths = require('../paths');
var runSequence = require('run-sequence');

var validateNpmVersionFlag = function() {
  var allowedVersions = [
    'major',
    'minor',
    'patch',
    'premajor',
    'preminor',
    'prepatch',
    'prerelease'
  ];

  var usage = [
    'gulp <deploy|tag>',
    '-v <' + allowedVersions.join('|') + '>',
    '[-m <commit message>]'
  ].join(' ');

  if (!_.includes(allowedVersions, argv.v)) {
    g.util.log(g.util.colors.green('Usage: ' + usage));
    throw new Error('"' + argv.v + '" is not a valid -v value.');
  }
};


//
// Deploy
//

gulp.task('deploy', 'deploy theme to cdn', function(cb) {
  validateNpmVersionFlag();
  runSequence(
    'require-clean-work-tree',
    'build',
    'docs',
    'commit-deploy',
    'tag',
    'push-follow-tags',
    'upload-to-s3',
    cb
  );
});

//
// Git
//

gulp.task('require-clean-work-tree', function(cb) {
  function handleStdout(stdout) {
    if (stdout.length > 0) {
      throw new Error(
        'This command cannot be run with uncommitted changes.\n' +
        'Commit or stash your changes and try again.'
      );
    }
  }

  var statusOpts = {args: '--short', quiet: true};
  var diffOpts = {args: 'diff', quiet: true};

  // ensure no unstaged file
  g.git.status(statusOpts, function(statusErr, statusStdout) {
    if (statusErr) {
      throw statusErr;
    }
    handleStdout(statusStdout);

    // ensure no uncommitted files
    g.git.exec(diffOpts, function(diffErr, diffStdout) {
      if (diffErr) {
        throw diffErr;
      }
      handleStdout(diffStdout);
      cb();
    });
  });
});

gulp.task('commit-deploy', function(cb) {
  var userMessage = argv.m ? argv.m : '@$(git config user.name)';
  var message = 'build: ' + userMessage;
  var gitAddCommand = 'git add -A .';
  var gitCommitCommand = 'git commit -m "' + message + '"';

  exec(gitAddCommand, function(err, stdout, stderr) {
    if (err) {
      throw new Error(stderr || stdout);
    }

    exec(gitCommitCommand, function(err, stdout, stderr) {
      if (err) {
        throw new Error(err || stderr);
      }
      cb();
    });
  });
});

gulp.task('push-follow-tags', function(cb) {
  var pushOpts = {args: '--follow-tags'};
  var revParseOpts = {args: '--abbrev-ref HEAD'};

  // get current branch
  g.git.revParse(revParseOpts, function(revParseErr, currentBranch) {
      if (revParseErr) {
        throw revParseErr;
      }

      // push to current branch
      g.git.push('origin', currentBranch, pushOpts, function(pushErr) {
        if (pushErr) {
          throw pushErr;
        }
        cb();
      });
    }
  );
});

//
// NPM
//

gulp.task('tag', function() {
  validateNpmVersionFlag();
  var userMessage = argv.m ? argv.m : '@$(git config user.name)';
  var commitMessage = 'tag v%s: ' + userMessage;

  // `npm version` will fail if the working tree is not clean.
  // We don't need to worry about adding/committing files.
  var npmVersionCmd = 'npm version ' + argv.v + ' -m "' + commitMessage + '"';
  var npmVersionOpts = {
    quiet: true,
    ignoreErrors: false,
    errorMessage: '<%= error.message %>\nCommand: `<%= command %>`'
  };

  return gulp.src('')
    .pipe(g.shell(npmVersionCmd, npmVersionOpts));
});

//
// S3 Upload
//

gulp.task('upload-to-s3', function(cb) {
  var pkg = require('../../package.json');
  var AWS_ACCESS_KEY_ID = process.env.RADIANT_AWS_ACCESS_KEY_ID;
  var AWS_SECRET_ACCESS_KEY = process.env.RADIANT_AWS_SECRET_ACCESS_KEY;

  if (!AWS_ACCESS_KEY_ID) {
    throw new Error('Missing RADIANT_AWS_ACCESS_KEY_ID. See README.md');
  }

  if (!AWS_SECRET_ACCESS_KEY) {
    throw new Error('Missing RADIANT_AWS_SECRET_ACCESS_KEY. See README.md');
  }

  var bucket = 'ta-radiant-assets';

  var publisher = g.awspublish.create({
    params: {
      Bucket: bucket
    },
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  });

  var headers = {};

  var prefix = '/' + pkg.version;

  var confirmUploadMessage = [
    'Upload build to S3 ',
    g.util.colors.yellow(bucket + prefix)
  ].join('');

  return gulp.src(paths.dist + '/**/*')
    // prefix S3 objects with package.json version number 
    .pipe(g.rename(function(path) {
      path.dirname = prefix + '/' + path.dirname;
    }))

    // publisher will add Content-Length, Content-Type and headers specified
    // above. If not specified it will set x-amz-acl to public-read by default.
    .pipe(publisher.publish(headers))

    // create a cache file to speed up consecutive uploads 
    .pipe(publisher.cache())

    // print upload updates to console 
    .pipe(g.awspublish.reporter());
});
