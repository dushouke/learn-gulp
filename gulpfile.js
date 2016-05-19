var gulp = require('gulp');

var concat = require('gulp-concat');
var myth = require('gulp-myth');

var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

var imagemin = require('gulp-imagemin');

var connect = require('connect');
var serve = require('serve-static');

var browsersync = require('browser-sync');

var plumber = require('gulp-plumber');
var beeper = require('beeper');

var del = require('del');

var sourcemaps = require('gulp-sourcemaps');

function onError(err) {
    beeper();
    console.log(err);
}

var cssFiles = ['app/css/main.css', 'app/css/*.css'];
gulp.task('styles', function () {
    return gulp.src(cssFiles)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(concat('all.css'))
        .pipe(myth())
        .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function () {
    return gulp.src('app/js/*.js')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sourcemaps.init())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
    return gulp.src('app/img/*')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

gulp.task('server', function () {
    return connect().use(serve(__dirname))
        .listen(8183)
        .on('listening', function () {
            console.log('Server Running: View at http://localhost:8183')
        });
});

gulp.task('browsersync', function (cb) {
    return browsersync({
        server: {
            baseDir: './'
        }
    }, cb);
});

gulp.task('clean', function (cb) {
    del(['dist/*','!dist/img/*'], cb);
});

gulp.task('watch', function () {
    gulp.watch('app/css/*.css', ['styles']).on('change', browsersync.reload);
    gulp.watch('app/js/*js', ['scripts']).on('change', browsersync.reload);
    gulp.watch('app/img/*', ['images']).on('change', browsersync.reload);
});

gulp.task('default', ['styles', 'scripts', 'images', 'server', 'browsersync', 'watch']);



