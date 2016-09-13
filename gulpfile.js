/**
 * Author:Herui/Administrator;
 * CreateDate:2016/2/16
 *
 * Describe:
 */
var fs = require('fs'),
    path = require('path'),
    //引入gulp
    gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    clean = require('gulp-clean'),
    autoprefixer = require('autoprefixer-stylus');

gulp.task('build-css',function(){
    gulp.src('_Runtime/Content/style/*.styl')
        .pipe(stylus({use: [autoprefixer({ browsers: ['last 2 versions', 'ie 9'], cascade: false })]}))
        .pipe(gulp.dest('Runtime/Content/style/'));
})

gulp.task('build-script', function() {
    gulp.src('_Runtime/Content/js/**/*')
        .pipe(gulp.dest('Runtime/Content/js/'));
});

gulp.task('build-images', function() {
    gulp.src(['_Runtime/Content/style/images/**/*'])
        .pipe(gulp.dest('Runtime/Content/style/images/'));
    gulp.src('_Runtime/Content/Upload/**.*').pipe(gulp.dest('Runtime/Content/Upload/'))
});

gulp.task('build-html', function() {
    gulp.src(['_Runtime/**/*.html'])
        .pipe(gulp.dest('Runtime/'));
});

gulp.task('clean', function() {
    return gulp.src('Runtime')
        .pipe(clean({ force: true }));
});

gulp.task('develop', ['clean'], function() {
    gulp.run('build-css', 'build-script', 'build-html', 'build-images');

    gulp.watch(['_Runtime/**/*.js'], function() {
        gulp.run('build-script');
    });
    gulp.watch(['_Runtime/**/*.styl'], function() {
        gulp.run('build-css');
    });
    gulp.watch(['_Runtime/**/*.html'], function() {
        gulp.run('build-html')
    });
});

gulp.task('default', function() {
    gulp.run('develop');
});