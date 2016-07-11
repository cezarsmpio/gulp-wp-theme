// Variables
var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var plugins = require('gulp-load-plugins');
var $ = plugins();
var request = require('request');

// Tasks
gulp.task('sass', function () {
  return gulp.src('development/sass/**/*.scss')
    .pipe($.plumber())
    .pipe($.sass({
      includePaths: [
        'node_modules',
        'bower_components',
        'development/sass'
      ]
    }))
    .pipe($.autoprefixer({
      browsers: ['last 5 versions']
    }))
    .pipe($.cssnano())
    .pipe(gulp.dest('.tmp/wordpress/wp-content/themes/gulp-wp-theme'));
});

gulp.task('scripts', function () {
  return gulp.src('development/js/main.js')
    .pipe($.plumber())
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe($.include({
      extensions: 'js',
      includePaths: [
        'node_modules',
        'bower_components',
        'development/js'
      ]
    }))
    .pipe($.uglify({
      mangle: true
    }))
    .pipe(gulp.dest('.tmp/wordpress/wp-content/themes/gulp-wp-theme/js'));
});

gulp.task('scripts:components', function () {
  return gulp.src('development/js/components/**/*.js')
    .pipe($.plumber())
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe($.include({
      extensions: 'js',
      includePaths: [
        'node_modules',
        'bower_components',
        'development/js'
      ]
    }))
    .pipe($.uglify({
      mangle: true
    }))
    .pipe(gulp.dest('.tmp/wordpress/wp-content/themes/gulp-wp-theme/js/components'));
});

gulp.task('scripts:vendor', function () {
  return gulp.src('development/js/vendor/**/*.js')
    .pipe($.plumber())
    .pipe($.concat('vendor.min.js'))
    .pipe($.uglify({
      mangle: true
    }))
    .pipe(gulp.dest('.tmp/wordpress/wp-content/themes/gulp-wp-theme/js/vendor'));
});

gulp.task('images', function () {
  return gulp.src('development/images/**/*')
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest('.tmp/wordpress/wp-content/themes/gulp-wp-theme/images'));
});

gulp.task('fonts', () => {
  return gulp.src('development/fonts/**/*')
    .pipe(gulp.dest('.tmp/fonts'));
});

gulp.task('php', ['sass', 'scripts', 'scripts:components', 'scripts:vendor', 'images', 'fonts'], function () {
  return gulp.src('development/**/*.php')
    .pipe($.plumber())
    .pipe(gulp.dest('.tmp/wordpress/wp-content/themes/gulp-wp-theme'));
});

gulp.task('wordpress', function () {
  return $.download('https://wordpress.org/latest.zip')
    .pipe($.unzip())
    .pipe(gulp.dest('.tmp'));
});

gulp.task('screenshot', function () {
  return gulp.src('screenshot.png')
    .pipe(gulp.dest('.tmp/wordpress/wp-content/themes/gulp-wp-theme'));
});

gulp.task('build', ['php'], function () {
  return gulp.src('.tmp/wordpress/**/*')
    .pipe(gulp.dest('dist'));
});

gulp.task('default', function () {
  gulp.start('build');
});

gulp.task('watch', ['php', 'screenshot'], function () {
  $.connectPhp.server({
    base: '.tmp/wordpress'
  }, function () {
    browserSync({
      proxy: '127.0.0.1:8000',
      notify: false
    });
  });

  gulp.watch('development/images/**/*', ['images']);
  gulp.watch('development/fonts/**/*', ['fonts']);
  gulp.watch('development/js/main.js', ['scripts']);
  gulp.watch('development/js/components/**/*.js', ['scripts:components']);
  gulp.watch('development/js/vendor/**/*.js', ['scripts:vendor']);
  gulp.watch('development/sass/**/*.scss', ['sass']);

  gulp.watch('development/**/*.php', ['php']);

  gulp.watch('development/**/*').on('change', function () {
    reload();
  });
});
