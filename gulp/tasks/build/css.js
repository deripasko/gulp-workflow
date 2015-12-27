// gulp/tasks/build/css.js
'use strict';

// ----------------------------------
// available tasks: 
//    'gulp build:css' : main css task
// ----------------------------------
// plugins:
//     gulp-sourcemaps        : $.sourcemaps
//     gulp-minify-css        : $.minifyCss
//     gulp-rename            : $.rename
//     gulp-plumber           : $.plumber
//     gulp-concat            : $.concat
//     gulp-uncss             : $.uncss
//     gulp-filter            : $.filter
//     gulp-cssbeautify       : $.cssbeautify
//     gulp-strip-css-comments: $.stripCssComments
// ----------------------------------
// config:
//     config.task.build : task name
// ----------------------------------

module.exports = function(gulp, $, path, config) {

    // avoid writing sourcemaps of sourcemaps
    var filter = $.filter(['*.css', '!*.map'], {
        restore: true
    });

    // start css task
    gulp.task(config.task.build + ':css', function() {

        return gulp.src([
                path.to.sass.dist.dev + '/vendor/*.css',
                path.to.sass.dist.dev + '/*.css',
                '!' + path.to.sass.dist.dev + '/**/_*{,/**}/'
            ])
            // prevent breaking errors
            .pipe($.plumber({
                errorHandler: config.error
            }))
            // remove unused css selectors
            .pipe($.uncss({
                html: [path.to.dist.dev + '*.html'],
                // more options
                // https://github.com/giakki/uncss#within-nodejs
            }))
            // strip unimportant css comments
            .pipe($.stripCssComments({
                preserve: true
            }))
            // beautify final css code
            .pipe($.cssbeautify({
                indent: '  '
            }))
            // initialize sourcemaps
            .pipe($.sourcemaps.init())
            // concat all css files
            .pipe($.concat('style.css'))
            // writing sourcemaps
            .pipe($.sourcemaps.write('.'))
            // dest unminified file
            .pipe(gulp.dest(path.to.sass.dist.prod))
            // filter css files
            .pipe(filter)
            // initialize sourcemaps before minify
            .pipe($.sourcemaps.init())
            // minify
            .pipe($.minifyCss({
                keepSpecialComments: 1
            }))
            // rename files
            .pipe($.rename({
                suffix: '.min'
            }))
            // writing sourcemaps for minified file
            .pipe($.sourcemaps.write('.'))
            // restoring filtered files
            .pipe(filter.restore)
            .pipe(gulp.dest(path.to.sass.dist.prod));

    });

};