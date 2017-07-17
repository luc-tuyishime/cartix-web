var gulp = require('gulp'),
 uglify = require('gulp-uglify');
 sass = require('gulp-ruby-sass');
 imagemin = require('gulp-imagemin');
//Scripts task
//uglify
gulp.task('scripts',function(){
  gulp.src('js/*.js')/*load the files*/
  .pipe(uglify())/*uglify them*/
  .pipe(gulp.dest('build/js'));/*save them into main.js*/
});

//Style task
//uglify
// gulp.task('styles',function(){
//   gulp.src('scss/**/*.scss')
//   .pipe(sass({
//     style: 'compressed'
//   }))
//   .pipe(gulp.dest('css/'));
// });


//Image task
//COmpress
 gulp.task('image',function(){
   gulp.src('img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('img'));

 });

//Watch task
//Watches JS
gulp.task('watch',function() {
 gulp.watch('js/*.js',['scripts']);
});

gulp.task('default',['scripts','watch']);
