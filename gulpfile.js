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
const svgo = require('gulp-svgo');

function conf() {
  const opts = {};
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
  const opts = conf();
  const bundler = watchify(browserify(opts).transform([babel, es2015]));
  function rebundle() {
    return bundler.bundle()
      .on('error', err => {
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
    bundler.on('update', () => {
      console.log('-> bundling...');
      rebundle();
      console.log('done bundling.');
    });
  }
  return rebundle();
}

function watch() {
  return compile(true);
}

// CSS
// ============================================================

gulp.task('css', () => {
  const plugins = [
    autoprefixer({browsers: ['last 1 version']}),
    cssnano()
  ];
  return gulp.src('./src/css/*.css')
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./public/dist/css'));
});

const cssWatcher = gulp.watch('src/css/*.css', ['css']);

cssWatcher.on('change', event => {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

// OTHER JS
// ============================================================

gulp.task('js', () => {
  return gulp.src('./src/js/loadJS.js')
    .pipe(gulp.dest('./public/dist/js'));
});

const jsWatcher = gulp.watch('./src/js/loadJS.js', ['js']);

jsWatcher.on('change', event => {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

// IMG
// ============================================================

gulp.task('img', () => {
  return gulp.src('./src/img/*.svg')
    .pipe(svgo())
    .pipe(gulp.dest('./public/dist/img'));
});

const imgWatcher = gulp.watch('src/img/*.svg', ['img']);

imgWatcher.on('change', event => {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

// BUILD
// ============================================================

gulp.task('build', () => {
  return compile();
});
gulp.task('watch', () => {
  return watch();
});

function glob() {
  return 'typeof self !== "undefined" ? self : ' + 'typeof window !== "undefined" ? window : {}'; // eslint-disable-line no-useless-concat
}

gulp.task('default', ['watch']);
