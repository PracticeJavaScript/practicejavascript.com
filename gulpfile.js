// DEPS
// ============================================================

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglifyES = require('uglify-es');
const composer = require('gulp-uglify/composer');
const uglify = composer(uglifyES, console);
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
const image = require('gulp-image');
const pump = require('pump');

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

const imageConfig = {
  pngquant: true,
  svgo: false,
  concurrent: 10,
  jpegoptim: true
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
      .pipe(uglify())
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
    // .pipe(uglify(uglifyConf))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/dist/js'));
});

const jsWatcher = gulp.watch('./src/js/loadJS.js', ['js']);

jsWatcher.on('change', event => {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

// IMG
// ============================================================

gulp.task('img-icons', () => {
  return gulp.src('./src/*.svg')
    .pipe(svgo())
    .pipe(gulp.dest('./public/'));
});

gulp.task('img-images', () => {
  return gulp.src('./src/img/*.{svg,png,jpg}')
    .pipe(svgo())
    .pipe(image(imageConfig))
    .pipe(gulp.dest('./public/dist/img'));
});

gulp.task('img', ['img-icons', 'img-images']);

const imgWatcher = gulp.watch('src/**/*.{svg,png}', ['img']);

imgWatcher.on('change', event => {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

// HTML
// ============================================================

gulp.task('html', () => {
  return gulp.src('./src/*.html')
    .pipe(htmlmin(htmlminConfig))
    .pipe(gulp.dest('./public/')); // Output goes to root of /public, as per firebase hosting
});

const htmlWatcher = gulp.watch('src/*.html', ['html']);

htmlWatcher.on('change', event => {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

// SERVICE WORKER
// ============================================================

const rootDir = './public';
gulp.task('generate-service-worker', callback => {
  swPrecache.write(`./src/service-worker.js`, {
    staticFileGlobs: [
      `${rootDir}/dist/**/*.{js,css,png,jpg,gif,svg,eot,ttf,woff}`,
      `${rootDir}/launcher-icon-*.{png,svg}`,
      `${rootDir}/index.html`
    ],
    stripPrefix: rootDir
  }, callback);
});

gulp.task('optimize-service-worker', ['generate-service-worker'], () => {
  return gulp.src(`./src/service-worker.js`)
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(uglify(uglifyConf))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public'));
});

// Do all service-worker things
gulp.task('service-worker', ['generate-service-worker', 'optimize-service-worker']);

const swWatcher = gulp.watch([rootDir + '/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}'], ['service-worker']);

swWatcher.on('change', event => {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});

// MANIFEST
// ============================================================

gulp.task('manifest', () => {
  return gulp.src('./src/manifest.json')
    .pipe(gulp.dest('./public/'));
});

const manifestWatcher = gulp.watch('src/manifest.json', ['manifest']);

manifestWatcher.on('change', event => {
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

gulp.task('default', ['build', 'manifest', 'service-worker', 'watch']);
