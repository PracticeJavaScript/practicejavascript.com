var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var watchify = require('watchify');
var babel = require('babelify');
var es2015 = require('babel-preset-es2015');


function conf() {
  var opts = {};
  opts.builtins = false;
  opts.entries = ['index.js'];
  opts.debug = true;
  opts.insertGlobalVars = {
    global: glob
  };
  return opts;
}

const uglifyConf = {

};


function compile(watch) {
  var opts = conf();

  var bundler = watchify(browserify(opts).transform([babel,es2015]));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) {
        console.error(err);
        this.emit('end');
      })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({
        loadMaps: true
      }))
      .pipe(uglify(uglifyConf))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist/js'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
};

gulp.task('build', function() {
  return compile();
});
gulp.task('watch', function() {
  return watch();
});

function glob() {
  return 'typeof self !== "undefined" ? self : ' + 'typeof window !== "undefined" ? window : {}';
}

gulp.task('default', ['watch']);
