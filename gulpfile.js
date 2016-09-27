var gulp = require('gulp'),
    clean = require('gulp-clean'),

    stylus = require('gulp-stylus'),
    autoprefixer = require('autoprefixer-stylus'),

    rollup = require('gulp-rollup'),
    babel = require('rollup-plugin-babel'),
    resolve = require('rollup-plugin-node-resolve'),
    commonjs = require('rollup-plugin-commonjs'),
    eslint = require('gulp-eslint'),

    sourcemaps = require('gulp-sourcemaps');

gulp.task('lint', function() {
    return gulp.src(['src/**/*.js', '!node_modules/**'])
        .pipe(eslint({
            parser: "babel-eslint"
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
})

gulp.task('css', function() {
    return gulp.src('src/style/css.styl')
        .pipe(stylus({ use: [autoprefixer({ browsers: ['last 2 versions', 'ie >= 9'], cascade: false })] }))
        .pipe(gulp.dest('dist/style'));
})

gulp.task('clean', function() {
    return gulp.src('dist', { read: false })
        .pipe(clean());
})

gulp.task('build', function() {
    gulp.src(['./src/**/*.js', './node_modules/jquery/dist/jquery.js', './library/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(rollup({
            entry: './src/index.js',
            format: 'umd',
            moduleName: 'htmlEditor',
            plugins: [
                resolve({
                    jsnext: true,
                    main: true,
                    browser: true,
                }),
                commonjs(),
                babel({
                    exclude: ['node_modules/**', 'bower_components/**']
                })
            ]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist'));
})

gulp.task('default', ['clean'], function() {
    gulp.run('build', 'css');

    gulp.watch([
        ['./src/**/*.js', './node_modules/jquery/dist/jquery.js', './library/**/*.js']
    ], function() {
        gulp.run('build');
    });

    gulp.watch('src/style/*.styl', function() {
        gulp.run('css');
    });
})