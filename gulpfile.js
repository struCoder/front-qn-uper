const gulp = require('gulp');
const changed = require('gulp-changed');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');


gulp.task('copy-js', function() {
  return gulp.src('./front/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'))
})
gulp.task('copy-zepto', function() {
  return gulp.src('./bower_components/zepto/zepto.min.js')
    .pipe(changed('./public/js/lib'))
    .pipe(gulp.dest('./public/js/lib'))
});

gulp.task('sass', function() {
  return gulp.src('./front/scss/index.scss')
    .pipe(sass.sync())
    .pipe(gulp.dest('./public/css'))
});

gulp.task('watch-js', function() {
  return gulp.watch('./front/js/*.js', ['copy-js']);
});

gulp.task('watch-sass', function() {
  return gulp.watch('./front/scss/*.scss', ['sass']);
});

gulp.task('watch', ['watch-sass', 'watch-js']);

gulp.task('copy', ['copy-zepto', 'copy-js']);


gulp.task('default', ['copy', 'sass', 'watch']);

gulp.task('pro', ['copy', 'sass']);
