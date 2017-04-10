var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var watchify = require('watchify');
var babel = require('babelify');
var es2015 = require('babel-preset-es2015');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

function conf() {
  var opts = {};
  opts.builtins = false;
  opts.entries = ['src/js/index.js'];
  opts.debug = true;
  opts.insertGlobalVars = {
    global: glob
  };
  return opts;
}

const uglifyConf = {};

function compile(watch) {
  var opts = conf();
  var bundler = watchify(browserify(opts).transform([babel,es2015]));
  function rebundle() {
    bundler.bundle()
      .on('error', function(err) {
        console.error(err);
        this.emit('end');
      })
      .pipe(source('bundle.min.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({
        loadMaps: true
      }))
      .pipe(uglify(uglifyConf))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/dist/js'));
  }
  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
      console.log('done bundling.');
    });
  }
  rebundle();
}

function watch() {
  return compile(true);
};


gulp.task('css', function () {
  var plugins = [
    autoprefixer({browsers: ['last 1 version']}),
    cssnano()
  ];
  return gulp.src('./src/css/*.css')
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./public/dist/css'));
});

var watcher = gulp.watch('src/css/*.css', ['css']);

watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

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
