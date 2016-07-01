// Variables
var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var plugins = require('gulp-load-plugins');
var $ = plugins();

// Tasks
gulp.task('sass', function () {
  return gulp.src('development/sass/**/*.scss')
    .pipe($.plumber())
    .pipe($.sass())
    .pipe($.autoprefixer({
      browsers: ['last 5 versions']
    }))
    .pipe(gulp.dest('.tmp/css'))
    .pipe(reload({stream: true}));
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
        'development/bower_components',
        'development/js'
      ]
    }))
    .pipe(gulp.dest('.tmp/js'))
    .pipe(reload({stream: true}));
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
        'development/bower_components',
        'development/js'
      ]
    }))
    .pipe(gulp.dest('.tmp/js/components'))
    .pipe(reload({stream: true}));
});

gulp.task('images', function () {
  return gulp.src('development/images/**/*')
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest('theme/images'));
});

gulp.task('fonts', () => {
  return gulp.src('development/fonts/**/*')
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('php', ['sass', 'scripts', 'scripts:components', 'images', 'fonts'], function () {
  return gulp.src('development/**/*.php')
    .pipe($.plumber())
    .pipe($.useref({searchPath: ['.tmp', 'development']}))
    .pipe($.if('*.js', $.uglify({
      mangle: true
    })))
    .pipe($.if('*.css', $.cssnano()))
    .pipe(gulp.dest('theme'));
});

gulp.task('build', ['php'], function () {
  return gulp.src('theme/**/*').pipe($.size({title: 'theme created', gzip: true}));
});

gulp.task('default', function () {
  gulp.start('build');
});

gulp.task('watch', ['scripts', 'scripts:components', 'sass'], function () {
  $.connectPhp.server({
    base: 'development'
  }, function () {
    browserSync({
      proxy: '127.0.0.1:8000',
      serveStatic: ['.tmp'],
      notify: false
    });
  });

  gulp.watch('development/images/**/*', ['images']);
  gulp.watch('development/fonts/**/*', ['fonts']);
  gulp.watch('development/js/**/*.js', ['scripts']);
  gulp.watch('development/sass/**/*.scss', ['sass']);

  gulp.watch('development/**/*.php').on('change', function () {
    reload()
  });
});
