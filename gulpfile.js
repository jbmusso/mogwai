var gulp = require('gulp');
var mocha = require('gulp-mocha');


function onChange(event) {
  console.log('File', event.type +':', event.path);
}

function onError(error) {
  console.error('\nError:', error.plugin);
  console.error(error.message);
}

gulp.task('test', function() {
  gulp.src('test/**/*')
      .pipe(mocha({
        reporter: 'spec',
      }))
      .on('error', onError);
});

gulp.task('watch', function() {
  gulp.watch('src/**/*', ['test']).on('change', onChange);
  gulp.watch('test/**/*', ['test']).on('change', onChange);
});

gulp.task('default', ['dev']);
gulp.task('dev', ['test', 'watch']);