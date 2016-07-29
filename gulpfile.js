// Variables
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var plugins     = require('gulp-load-plugins');
var $           = plugins();
var request     = require('request');
var config      = require('./gulp.config.js');

// Tasks
gulp.task('sass', function () {
  return gulp.src(config.development_path + 'sass/**/*.{scss,sass}')
    .pipe($.plumber())
    .pipe($.sass({
      includePaths: [
        'node_modules',
        'bower_components',
         config.development_path + 'sass'
      ]
    }))
    .pipe($.autoprefixer({
      browsers: ['last 5 versions']
    }))
    .pipe($.concat('style.css'))
    .pipe($.cssnano())
    .pipe(gulp.dest(config.tmp_path + 'wordpress/wp-content/themes/' + config.theme_path));
});

gulp.task('scripts', function () {
  return gulp.src(config.development_path + 'js/main.js')
    .pipe($.plumber())
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe($.include({
      extensions: 'js',
      includePaths: [
        'node_modules',
        'bower_components',
         config.development_path + 'js'
      ]
    }))
    .pipe($.uglify({
      mangle: true
    }))
    .pipe(gulp.dest(config.tmp_path + 'wordpress/wp-content/themes/' + config.theme_path + '/js'));
});

gulp.task('scripts:components', function () {
  return gulp.src(config.development_path + 'js/components/**/*.js')
    .pipe($.plumber())
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe($.include({
      extensions: 'js',
      includePaths: [
        'node_modules',
        'bower_components',
         config.development_path + 'js'
      ]
    }))
    .pipe($.uglify({
      mangle: true
    }))
    .pipe(gulp.dest(config.tmp_path + 'wordpress/wp-content/themes/' + config.theme_path + '/js/components'));
});

gulp.task('scripts:vendor', function () {
  return gulp.src(config.development_path + 'js/vendor/**/*.js')
    .pipe($.plumber())
    .pipe($.concat('vendor.min.js'))
    .pipe($.uglify({
      mangle: true
    }))
    .pipe(gulp.dest(config.tmp_path + 'wordpress/wp-content/themes/' + config.theme_path + '/js/vendor'));
});

gulp.task('images', function () {
  return gulp.src(config.development_path + 'images/**/*')
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest(config.tmp_path + 'wordpress/wp-content/themes/' + config.theme_path + '/images'));
});

gulp.task('fonts', () => {
  return gulp.src(config.development_path + 'fonts/**/*')
    .pipe(gulp.dest(config.tmp_path + 'fonts'));
});

gulp.task('php', ['sass', 'scripts', 'scripts:components', 'scripts:vendor', 'images', 'fonts'], function () {
  return gulp.src(config.development_path + '**/*.php')
    .pipe($.plumber())
    .pipe(gulp.dest(config.tmp_path + 'wordpress/wp-content/themes/' + config.theme_path));
});

gulp.task('wordpress', function () {
  return $.download('https://wordpress.org/latest.zip')
    .pipe($.unzip())
    .pipe(gulp.dest('.tmp'));
});

gulp.task('screenshot', function () {
  return gulp.src('screenshot.png')
    .pipe(gulp.dest(config.tmp_path + 'wordpress/wp-content/themes/' + config.theme_path));
});

gulp.task('build', ['php'], function () {
  return gulp.src(config.tmp_path + 'wordpress/**/*')
    .pipe(gulp.dest(config.dist_path));
});

gulp.task('default', function () {
  gulp.start('build');
});

gulp.task('watch', ['php', 'screenshot'], function () {
  $.connectPhp.server({
    base:  config.tmp_path + 'wordpress'
  }, function () {
    browserSync({
      proxy: '127.0.0.1:8000',
      notify: false
    });
  });

  gulp.watch(config.development_path + 'images/**/*', ['images']);
  gulp.watch(config.development_path + 'fonts/**/*', ['fonts']);
  gulp.watch(config.development_path + 'js/main.js', ['scripts']);
  gulp.watch(config.development_path + 'js/components/**/*.js', ['scripts:components']);
  gulp.watch(config.development_path + 'js/vendor/**/*.js', ['scripts:vendor']);
  gulp.watch(config.development_path + 'sass/**/*.{scss,sass}', ['sass']);

  gulp.watch(config.development_path + '**/*.php', ['php']);

  gulp.watch(config.development_path + '**/*').on('change', function () {
    reload();
  });
});
