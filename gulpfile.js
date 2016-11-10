var
    gulp = require('gulp'),
    clean = require('gulp-clean'),

    stylus = require('gulp-stylus'),
    autoprefixer = require('autoprefixer-stylus'),
    spriter = require('gulp-css-spriter'),

    server = require('gulp-ss-server');


gulp.task('css', function() {
    gulp.run('image');
    return gulp.src('src/style/*.styl')
        .pipe(stylus({ use: [autoprefixer({ browsers: ['last 2 versions', 'ie >= 8'], cascade: false })] }))
        // .pipe(spriter({
        //     'spriteSheet': 'dist/style/images/sprite.png',
        //     'pathToSpriteSheetFromCSS': 'images/sprite.png'
        // }))
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

gulp.task('script', function() {
    return gulp.src([
        'src/*.js'
    ]).pipe(gulp.dest('dist'));
})

gulp.task('connect', function() {
    server.run({
        port: 3000
    });
});

gulp.task('default', ['clean', 'connect'], function() {
    gulp.run('css', 'image', 'script');
    gulp.watch('src/style/*.styl', function() {
        gulp.run('css');
    })
    gulp.watch('src/*.js', function() {
        gulp.run('script');
    })
})