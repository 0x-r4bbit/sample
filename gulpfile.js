var gulp = require('gulp');
var path = require('path');

var vinylPaths = require('vinyl-paths');
var del = require('del');
var serve = require('browser-sync');
var runSequence = require('run-sequence');
var glob = require('glob');

var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var htmlReplace = require('gulp-html-replace');
var html2js = require('gulp-ng-html2js');

var ESLINT_FILE = '.eslintrc';
var root = 'src';
var dist = 'dist';

var paths = {
  js: '**/*.js',
  css: '**/*.css',
  html: '**/*.html',
  spec: '**/*.spec.js',
  tpls: '**/*.tpl.html'
};

var reload = serve.reload;

function resolveGlob(pattern) {
  return glob.sync(pattern).map(function (filename) {
    return filename.replace('dist/', '');
  });
}

gulp.task('default', function (cb) {
  runSequence('build', 'serve', cb);
});

gulp.task('build', function (cb) {
  runSequence(
    'clean',
    ['html2js','scripts'],
    ['html', 'styles'],
    cb
  );
});

gulp.task('clean', function () {
  return gulp.src(dist)
    .pipe(vinylPaths(del));
});

gulp.task('scripts', function () {
  return gulp.src([path.join(root, paths.js), '!' + path.join(root, paths.spec)])
    .pipe(eslint({
      configFile: path.join(__dirname, ESLINT_FILE)
    }))
    .pipe(eslint.formatEach('stylish'))
    .pipe(eslint.failOnError())
    .pipe(ngAnnotate())
    .pipe(gulp.dest(dist));
});

gulp.task('styles', function () {
  return gulp.src(path.join(root, paths.css))
    .pipe(gulp.dest(dist));
});

gulp.task('html', function () {
  return gulp.src(path.join(root, paths.html))
    .pipe(htmlReplace({
      js: resolveGlob(path.join(dist, paths.js)),
      css: resolveGlob(path.join(dist, paths.css))
    }))
    .pipe(gulp.dest(dist));
});

gulp.task('html2js', function () {
  return gulp.src(path.join(root, paths.tpls))
    .pipe(html2js({
      moduleName: 'templateCache',
      rename: function (templateUrl, templateFile) {
        return path.basename(templateUrl);
      }
    }))
    .pipe(gulp.dest(path.join(dist)))
});

gulp.task('serve', function () {
  serve({
    port: process.env.PORT || 3000,
    open: false,
    files: [].concat(
      path.join(root, paths.js),
      path.join(root, paths.css),
      path.join(root, paths.html)
    ),
    server: {
      baseDir: dist
    },
  });

  gulp.watch(path.join(root, paths.html), ['html', reload]);
  gulp.watch(path.join(root, paths.css), ['styles', reload]);
  gulp.watch(path.join(root, paths.js), ['scripts', reload]);
});
