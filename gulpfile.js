// Variables
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var plugins     = require('gulp-load-plugins');
var $           = plugins();
var request     = require('request');
var config      = require('./gulp.config.js');
var webpack     = require('webpack-stream');
var syncy       = require('syncy');

// Tasks
gulp.task('sass', function () {
  return gulp.src(`${config.development_path}/sass/**/*.{scss,sass}`)
    .pipe($.plumber())
    .pipe($.sass({
      includePaths: [
        'node_modules',
        'bower_components',
        `${config.development_path}/sass`
      ]
    }))
    .pipe($.autoprefixer({
      browsers: ['last 5 versions']
    }))
    .pipe($.concat('style.css'))
    .pipe($.cssnano())
    .pipe(gulp.dest(`${config.tmp_path}/wordpress/wp-content/themes/${config.theme_path}`));
});

gulp.task('scripts', function () {
  return gulp.src(`${config.development_path}/js/main.js`)
    .pipe($.plumber())
    .pipe(webpack({
      output: {
        filename: 'main.js'
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
              presets: ['es2015']
            }
          }
        ]
      }
    }))
    .pipe(gulp.dest(`${config.tmp_path}/wordpress/wp-content/themes/${config.theme_path}/js`));
});


gulp.task('images', function () {
  return gulp.src(`${config.development_path}/images/**/*`)
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest(`${config.tmp_path}/wordpress/wp-content/themes/${config.theme_path}/images`));
});

gulp.task('fonts', () => {
  return gulp.src(`${config.development_path}/fonts/**/*`)
    .pipe(gulp.dest(`${config.tmp_path}/fonts`));
});

gulp.task('php', function (done) {
  syncy(
    [`${config.development_path}/**/*.php`],
    `${config.tmp_path}/wordpress/wp-content/themes/${config.theme_path}`,
    {
      verbose: true,
      base: config.development_path,
      ignoreInDest: '!**/*.php'
    }
  )
    .then(() => {
      done();
    })
    .catch(err => {
      done(err);
    });
});

gulp.task('wordpress', function () {
  return $.download('https://wordpress.org/latest.zip')
    .pipe($.unzip())
    .pipe(gulp.dest('.tmp'));
});

gulp.task('screenshot', function () {
  return gulp.src('screenshot.png')
    .pipe(gulp.dest(`${config.tmp_path}/wordpress/wp-content/themes/${config.theme_path}`));
});

gulp.task('build', ['php'], function () {
  return gulp.src(`${config.tmp_path}/wordpress/**/*`)
    .pipe(gulp.dest(config.dist_path));
});

gulp.task('default', function () {
  gulp.start('build');
});

let defaultTasks = ['php', 'screenshot', 'sass', 'scripts', 'images', 'fonts'];

gulp.task('watch', defaultTasks, function () {
  $.connectPhp.server({
    base:  `${config.tmp_path}/wordpress`
  }, function () {
    browserSync({
      proxy: '127.0.0.1:8000',
      notify: false
    });
  });

  gulp.watch(`${config.development_path}/images/**/*`, ['images']);
  gulp.watch(`${config.development_path}/fonts/**/*`, ['fonts']);
  gulp.watch(`${config.development_path}/js/main.js`, ['scripts']);
  gulp.watch(`${config.development_path}/sass/**/*.{scss,sass}`, ['sass']);

  gulp.watch(`${config.development_path}/**/*.php`, ['php']);

  gulp.watch(`${config.development_path}/**/*`).on('change', function (e) {
    reload();
  });
});
