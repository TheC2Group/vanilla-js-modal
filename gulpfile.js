var gulp = require('gulp');
var run = require('gulp-run');

function bundle () {
    return run('npm run bundle-example').exec();
};

function build () {
    return run('npm run build').exec();
};

exports.watch = function () {
    var files = [
        'modal-handler.js',
        'example/js/simple.js',
        'example/js/on-the-fly.js'
    ];

    return gulp.watch(files, gulp.series(build, bundle));
};
