var gulp = require('gulp'),
  $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'del', 'wiredep', 'main-bower-files']
  });
gulp.task('autoprefixer', function () {
  return gulp.src('src/**/*.css')
    .pipe($.sourcemaps.init())
    .pipe($.autoprefixer())
    .pipe($.concat('all.css'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('public/css'));
});
gulp.task('bower', function () {
  gulp
    .src($.mainBowerFiles('**/*.js'))
    .pipe($.concat('build.js'))
    .pipe(gulp.dest('public/lib'));
});

gulp.task('babel', function () {
  return gulp.src('src/**/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.concat('all.js'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('clean', function () {
  $.del('public');
});

gulp.task('jade:dev', function () {
  gulp
    .src(['src/**/*.jade'])
    .pipe($.jade({
      pretty: true
    }))
    .pipe(gulp.dest('public'));
});

gulp.task('jade:prod', function () {
  gulp
    .src(['src/**/*.jade', '!src/**/_*.jade'])
    .pipe($.jade())
    .pipe(gulp.dest('public'));
});

gulp.task('sass:dev', function () {
  gulp
    .src('src/_styles/main.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('public/css'));
});

gulp.task('sass:prod', function () {
  gulp
    .src('src/_styles/main.scss')
    .pipe($.sass({
        outputStyle: 'compressed'
      })
      .on('error', $.sass.logError)
    )
    .pipe(gulp.dest('public/css'));
});

gulp.task('build', ['clean', 'jade:prod', 'sass:prod', 'bower']);


//gulp.task('serve', function () {
//  $.livereload.listen(8080);
//  gulp.watch(['src/**/*.jade'], ['jade:dev']);
//  gulp.watch(['src/**/*.scss'], ['sass:dev']);
//  gulp.watch(['src/**/*'], ['build']);
//});
gulp.task('connect', function () {
  $.connect.server({
    root: 'public',
    port: 9000,
    livereload: true
  });
  gulp.watch(['src/**/*.jade'], ['jade:dev']);
  gulp.watch(['src/**/*.scss'], ['sass:dev']);
  gulp.watch(['src/**/*'], ['build']);
});
gulp.task('default', function () {});
