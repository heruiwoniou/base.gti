var gulp=require('gulp'),
	rollup=require('gulp-rollup'),
	sourcemaps=require('gulp-sourcemaps'),
	clean=require('gulp-clean'),
	babel=require('rollup-plugin-babel'),
	eslint=require('gulp-eslint');

gulp.task('lint',function(){
	return gulp.src(['src/**/*.js','!node_modules/**'])
		.pipe(eslint({
			parser:"babel-eslint"
		}))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
})

gulp.task('clean',function(){
	return gulp.src('dist', {read: false})
		.pipe(clean());
})

gulp.task('build',function(){

	gulp.src('src/index.js', {read: false})
	    .pipe(rollup({
	    	sourceMap: true,
	    	format: 'umd',
	    	moduleName:'Calendar',
	        plugins:[babel({"presets": ["es2015-rollup"]})]
	    }))
	    .pipe(sourcemaps.write())
	    .pipe(gulp.dest('dist'));
})

gulp.task('default',['clean'],function(){
	gulp.run('build');

	gulp.watch(['src/**/*.js'],function(){
		gulp.run('build');
	})
})