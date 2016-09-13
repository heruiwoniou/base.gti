var gulp = require('gulp'),
    rollup = require('gulp-rollup'),
    sourcemaps = require('gulp-sourcemaps'),
    clean = require('gulp-clean'),
    babel = require('rollup-plugin-babel'),
    eslint = require('gulp-eslint'),

    stylus = require('gulp-stylus'),
    autoprefixer = require('autoprefixer-stylus');

gulp.task('lint', function() {
    return gulp.src(['src/**/*.js', '!node_modules/**'])
        .pipe(eslint({
            parser: "babel-eslint"
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
})

gulp.task('css', function() {
    return gulp.src('src/style/*.styl')
        .pipe(stylus({ use: [autoprefixer({ browsers: ['last 2 versions', 'ie 9'], cascade: false })] }))
        .pipe(gulp.dest('dist/style'));
})

gulp.task('clean', function() {
    return gulp.src('dist', { read: false })
        .pipe(clean());
})

gulp.task('build', function() {

    gulp.src('src/index.js', { read: false })
        .pipe(rollup({
            sourceMap: true,
            format: 'umd',
            moduleName: 'Schedule',
            plugins: [babel({ "presets": ["es2015-rollup"] })]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
    gulp.src('src/Calendar.js', { read: false })
        .pipe(rollup({
            sourceMap: true,
            format: 'umd',
            moduleName: 'Calendar',
            plugins: [babel({ "presets": ["es2015-rollup"] })]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
})

gulp.task('default', ['clean'], function() {
    gulp.run('build', 'css');

    gulp.watch(['src/**/*.js'], function() {
        gulp.run('build');
    });

    gulp.watch('src/style/*.styl', function() {
        gulp.run('css');
    });
})