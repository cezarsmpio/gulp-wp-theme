// global configs
import config from './gulp.config';

// gulp + core imports
import gulp from 'gulp';
import browserSync from 'browser-sync';
import plugins from 'gulp-load-plugins';

import webpack from 'webpack-stream';
import TerserPlugin from 'terser-webpack-plugin';

const { reload } = browserSync;
const $ = plugins();
const defaultTasks = [
  'php',
  'screenshot',
  'sass',
  'scripts',
  'images',
  'fonts'
];

// Tasks
gulp.task('sass', () => {
  return gulp
    .src(`${config.development_path}/sass/**/style.scss`)
    .pipe($.plumber())
    .pipe(
      $.sass({
        includePaths: [
          'node_modules',
          'bower_components',
          `${config.development_path}/sass`
        ],
        outputStyle: 'compressed'
      }).on('error', $.sass.logError)
    )
    .pipe($.concat('style.css'))
    .pipe(
      gulp.dest(
        `${config.tmp_path}/wordpress/wp-content/themes/${config.theme_path}`
      )
    );
});

gulp.task('scripts', () => {
  return gulp
    .src(`${config.development_path}/js/main.js`)
    .pipe($.eslint())
    .pipe($.plumber())
    .pipe(
      webpack({
        mode: 'production',
        target: 'web',
        output: {
          filename: 'main.js'
        },
        node: {
          __dirname: false
        },
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader'
              }
            }
          ]
        },
        optimization: {
          minimizer: [
            new TerserPlugin({
              extractComments: true
            })
          ]
        },
        performance: {
          hints: false
        }
      })
    )
    .pipe(
      gulp.dest(
        `${config.tmp_path}/wordpress/wp-content/themes/${config.theme_path}/js`
      )
    );
});

gulp.task('images', () => {
  return gulp
    .src(`${config.development_path}/images/**/*`)
    .pipe(
      gulp.dest(
        `${config.tmp_path}/wordpress/wp-content/themes/${config.theme_path}/images`
      )
    );
});

gulp.task('fonts', done => {
  return gulp
    .src(`${config.development_path}/fonts/**/*`)
    .pipe(
      gulp.dest(
        `${config.tmp_path}/wordpress/wp-content/themes/${config.theme_path}/fonts`
      )
    );
});

gulp.task('php', done => {
  return gulp
    .src(`${config.development_path}/**/*.php`)
    .pipe(
      gulp.dest(
        `${config.tmp_path}/wordpress/wp-content/themes/${config.theme_path}`
      )
    );
});

gulp.task('wordpress', () => {
  return $.download('https://wordpress.org/latest.zip')
    .pipe($.unzip())
    .pipe(gulp.dest(config.tmp_path));
});

gulp.task('screenshot', () => {
  return gulp
    .src('screenshot.png')
    .pipe(
      gulp.dest(
        `${config.tmp_path}/wordpress/wp-content/themes/${config.theme_path}`
      )
    );
});

gulp.task(
  'build',
  gulp.series(...defaultTasks, () => {
    return gulp
      .src(`${config.tmp_path}/wordpress/**/*`)
      .pipe(gulp.dest(config.dist_path));
  })
);

gulp.task(
  'watch',
  gulp.series(...defaultTasks, done => {
    $.connectPhp.server(
      {
        base: `${config.tmp_path}/wordpress`
      },
      () => {
        browserSync({
          proxy: '127.0.0.1:8000',
          notify: false
        });
      }
    );

    gulp.watch(
      `${config.development_path}/images/**/*`,
      gulp.series('images')
    );
    gulp.watch(
      `${config.development_path}/fonts/**/*`,
      gulp.series('fonts')
    );
    gulp.watch(
      `${config.development_path}/js/**/*.js`,
      gulp.series('scripts')
    );
    gulp.watch(
      `${config.development_path}/sass/**/*.{css,scss,sass}`,
      gulp.series('sass')
    );

    gulp.watch(
      `${config.development_path}/**/*.php`,
      gulp.series('php')
    );

    gulp
      .watch(`${config.development_path}/**/*`)
      .on('change', function(e) {
        reload();
      });

    done();
  })
);
