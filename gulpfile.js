// DEPS
// ============================================================

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const watchify = require('watchify');
const babel = require('babelify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const svgo = require('gulp-svgo');
const sass = require('gulp-sass');
const livereload = require('gulp-livereload');
const htmlmin = require('gulp-htmlmin');
const swPrecache = require('sw-precache');

// CONFIG
// ============================================================
const browserslist = require('./package.json').browserslist;

const opts = {
  builtins: false,
  entries: ['src/js/index.js'],
  debug: true,
  insertGlobalVars: {
    global: glob
  }
};

const uglifyConf = {};

const htmlminConfig = {
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: true
};

// TASKS
// ============================================================

function compile(watch) {
  const bundler = watchify(browserify(opts).transform(babel.configure({
    presets: [
      ['env', {
        targets: {
          browsers: browserslist
        }
      }]
    ]
  })));
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
    autoprefixer({browsers: browserslist}),
    cssnano()
  ];
  return gulp.src('./src/css/style.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('./public/dist/css'))
    .pipe(livereload());
});

const cssWatcher = gulp.watch('src/css/**/*.scss', ['css']);

cssWatcher.on('change', event => {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

// OTHER JS
// ============================================================

gulp.task('js', () => {
  return gulp.src(['./src/js/*.js', '!./src/js/index.js'])
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(uglify(uglifyConf))
    .pipe(sourcemaps.write('./'))
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

// HTML
// ============================================================

gulp.task('html', () => {
  return gulp.src('./src/html/*.html')
    .pipe(htmlmin(htmlminConfig))
    .pipe(gulp.dest('./public/')); // Output goes to root of /public, as per firebase hosting
});

const htmlWatcher = gulp.watch('src/html/*.html', ['html']);

htmlWatcher.on('change', event => {
// SERVICE WORKER
// ============================================================

const rootDir = './public';
gulp.task('generate-service-worker', callback => {
  swPrecache.write(`./src/service-worker/service-worker.js`, {
    staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}'],
    stripPrefix: rootDir
  }, callback);
});

const swWatcher = gulp.watch([rootDir + '/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}'], ['generate-service-worker']);

swWatcher.on('change', event => {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

gulp.task('optimize-service-worker', () => {
  gulp.src(`./src/service-worker/service-worker.js`)
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(uglify(uglifyConf))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public'));
});

const swOptoWatcher = gulp.watch(`./src/service-worker/service-worker.js`, ['optimize-service-worker']);

swOptoWatcher.on('change', event => {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

// BUILD
// ============================================================

gulp.task('build', ['css', 'js', 'img', 'html'], () => {
  return compile();
});
gulp.task('watch', () => {
  livereload.listen();
  return watch();
});

function glob() {
  return 'typeof self !== "undefined" ? self : ' + 'typeof window !== "undefined" ? window : {}'; // eslint-disable-line no-useless-concat
}

gulp.task('default', ['build', 'generate-service-worker', 'optimize-service-worker', 'watch']);
