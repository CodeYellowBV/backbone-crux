'use strict';

var ROOT_PATH = './',
    TEST_DIR = 'test/',
    gulp = require('gulp'),
    shell = require('gulp-shell'),
    jshint = require('gulp-jshint'),
    ghelp = require('gulp-showhelp'),
    path = require('path'),
    appFiles = ['./**/*.js', '!./node_modules/**/*', '!gulpfile.js'],
    jshintConfig = path.join(ROOT_PATH, '.jshintrc');

gulp.task('watch-jshint', function() {
    // Rerun every time a file changes.
    gulp.watch('**/*.js', function () {
        gulp.src(appFiles)
            .pipe(jshint(jshintConfig))
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(jshint.reporter('fail'));
    });
});

gulp.task('jshint', function () {
    return gulp.src(appFiles)
        .pipe(jshint(jshintConfig))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .on('error', process.exit.bind(process, 1));
}).help = 'Run jshint linter and output to console.';

gulp.task('help', function() {
    ghelp.show();
}).help = 'Shows this help message.'; 

gulp.task('test', ['jshint'], function () {
    return gulp.src('')
        .pipe(shell('node_modules/run-headless-chromium/run-headless-chromium.js ' + path.join(ROOT_PATH, TEST_DIR) + '/index.html --disable-setuid-sandbox'))
        .on('error', process.exit.bind(process, 1));
}).help = 'Run front-end tests.';

gulp.task('default', ['test']).help = 'Run tests.';