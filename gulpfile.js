const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const watchify = require('watchify');
const babel = require('babelify');
const es2015 = require('babel-preset-es2015');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

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


// CSS
// ============================================================

gulp.task('css', function () {
  var plugins = [
    autoprefixer({browsers: ['last 1 version']}),
    cssnano()
  ];
  return gulp.src('./src/css/*.css')
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./public/dist/css'));
});

const cssWatcher = gulp.watch('src/css/*.css', ['css']);

cssWatcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});


// IMG
// ============================================================

gulp.task('img', function () {
  return gulp.src('./src/img/*.svg')
    .pipe(gulp.dest('./public/dist/img'));
});

const imgWatcher = gulp.watch('src/img/*.svg', ['img']);

cssWatcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});


// BUILD
// ============================================================

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
