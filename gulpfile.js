var
    net = require('net'),
    gulp = require('gulp'),
    clean = require('gulp-clean'),

    stylus = require('gulp-stylus'),
    autoprefixer = require('autoprefixer-stylus'),
    spriter = require('gulp-css-spriter'),
    concat = require('gulp-concat'),

    replace = require('gulp-replace'),

    rollup = require('gulp-rollup'),
    babel = require('rollup-plugin-babel'),
    resolve = require('rollup-plugin-node-resolve'),
    commonjs = require('rollup-plugin-commonjs'),
    eslint = require('gulp-eslint'),

    sourcemaps = require('gulp-sourcemaps'),
    rollupsourcemaps = require('rollup-plugin-sourcemaps'),
    connect = require('gulp-connect'),

    banner =
    '\n/*!\n' +
    ' * library-base.js v0.0.1\n' +
    ' * (c) ' + new Date().getFullYear() + ' heruiwoniou/xiaohongmei/dengfan\n' +
    ' * Released under the MIT License.\n' +
    ' */\n'

gulp.task('lint', function() {
    return gulp.src(['src/**/*.js', '!node_modules/**'])
        .pipe(eslint({
            parser: "babel-eslint"
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
})

gulp.task('css', function() {
    gulp.run('image');
    return gulp.src('src/style/*.styl')
        .pipe(stylus({ use: [autoprefixer({ browsers: ['last 2 versions', 'ie >= 9'], cascade: false })] }))
        .pipe(spriter({
            'spriteSheet': 'dist/style/images/sprite.png',
            'pathToSpriteSheetFromCSS': 'images/sprite.png'
        }))
        .pipe(gulp.dest('dist/style'));
})

gulp.task('image', function() {
    return gulp.src([
        'src/style/images/*.*'
    ]).pipe(gulp.dest('dist/style/images'));
})

gulp.task('clean', function() {
    return gulp.src('dist', { read: false })
        .pipe(clean());
})

gulp.task('connect', function() {
    (function(port) {
        var s = arguments.callee;
        var server = net.createServer().listen(port);
        server.on('listening', function() {
            server.close()
            connect.server({
                port: port
            });
        });
        server.on('error', function() {
            s(port++);
        })
    })(3000)
});

gulp.task('build', ['lint'], function() {
    gulp.src(['./src/**/*.js'], { base: 'src' })
        //.pipe(sourcemaps.init())
        .pipe(rollup({
            sourceMap: true,
            entry: './src/index.js',
            format: 'umd',
            moduleName: 'selector',
            plugins: [
                resolve({
                    jsnext: true,
                    main: true,
                    browser: true,
                }),
                commonjs(),
                babel({
                    exclude: ['node_modules/**', 'bower_components/**']
                }),
                //rollupsourcemaps()
            ]
        }))
        .pipe(concat('index.js'))
        .pipe(replace(/^([\s\S])/, banner + '$1'))
        //.pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('./dist'));
})

gulp.task('default', ['clean', 'connect'], function() {
    gulp.run('build', 'css');

    gulp.watch([
        ['./src/**/*.js', './node_modules/jquery/dist/jquery.js', './library/**/*.js', './bower_components/**/*.js']
    ], function() {
        gulp.run('build');
    });

    gulp.watch('src/style/*.styl', function() {
        gulp.run('css');
    });
})