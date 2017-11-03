const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');



// Static server
gulp.task('server', function() {
    browserSync.init({
        server: {
        	port:9000,
            baseDir: 'build'
        }
    });

gulp.watch('build/**/*').on('change',  browserSync.reload);


});

//  pug compile

gulp.task('pug', function buildHTML() {
  return gulp.src('source/template/index.pug')
  .pipe(pug({
    // Your options in here. 
    pretty: true
  }))
  .pipe(gulp.dest('build'))
});

//  sass compile

gulp.task('sass', function () {
  return gulp.src('source/styles/main.scss')
    .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/css'));
});


//  sprite compile

gulp.task('sprite', function (cb) {
  const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.png',
    cssName: 'sprite.scss'
  }));
  spriteData.img.pipe(gulp.dest('build/image/'));
 spriteData.css.pipe(gulp.dest('source/styles/global/'));
cb();
});

// delete
gulp.task('clean', function del(cb) {
	return rimraf('build', cb);
});

// copy fonts
gulp.task('copy:fonts', function () {
	return gulp.src('./sourse/fonts/**/*.*')
	.pipe(gulp.dest('build/fonts'));
});


// copy images
gulp.task('copy:images', function () {
	return gulp.src('./sourse/images/**/*.*')
	.pipe(gulp.dest('build/images'));
});

// copy 
gulp.task('copy', gulp.parallel('copy:fonts','copy:images'));

// watchers
gulp.task('watch', function() {
gulp.task('source/template/**/*.pug', gulp.series('pug'));
gulp.task('source/styles/**/*.scss', gulp.series('sass'));
});


gulp.task('default', gulp.series('clean',

gulp.parallel('pug', 'sass', 'sprite', 'copy'),

gulp.parallel('watch', 'server')
));