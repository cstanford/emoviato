/**
 * This is the Gulp build configuration file.
 * Here, you will find the task definitions for specific build tasks.
 * See Gulp documentation for examples:
 *      https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
 */
var path = require('path');
var emoviatoRoot = path.join(__dirname, '..');
// First, let's switch to the root, so all gulp
// paths will be resolved from the root dir.
process.chdir(emoviatoRoot);

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
const eslint = require('gulp-eslint');
var shell = require('gulp-shell');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var clean = require('gulp-clean');
var frep = require('gulp-frep');
var gutil = require('gulp-util');
gutil.log('Gulp root directory is ' + emoviatoRoot);

/**
 * Pattern to be used by gulp-frep to
 * replace End of Line characters in JS files.
 */
var newLinePattern = [
  {
    // Normalize and condense newlines
    pattern: /(\r\n|\n)/g,
    replacement: '\u000A'
  }
];

var taskFinishEvt = 'finish';

/**
 * A concatenated file containing all Angular scripts
 * we have written. The app will load this single JS file
 * to get all of our Angular code.
 */
var jsFileName = 'emoviatoApp.js'; // Name of concanated app
var jsOutputDir = path.join(emoviatoRoot, 'public', 'build', 'js'); // where this file will be

/**
 * All of our Angular Code, as well as the angular lib and a few other
 * third party libs related to Angular.
 */
var jsFiles = [
    'public/app/app.js',
    'public/app/**/config/*.js',
    'public/app/**/*.js'
];


/**
 * Can be called via:
 *      log('the message')
 *  or
 *      log.bind('the message')
 */
var log = function(msg) {
    gutil.log((msg) ? msg.toString() : this.toString());
};

var jsOutputMessage = 'Task: "js" created ' + path.join(jsOutputDir, jsFileName);

gulp.task('js', function() {
    return gulp.src(jsFiles)
    .pipe(ngAnnotate())
    .pipe(concat(jsFileName))
    .pipe(frep(newLinePattern))
    .pipe(gulp.dest(jsOutputDir))
    .on(taskFinishEvt, log.bind(jsOutputMessage));
});

gulp.task('js-ugly', function() {
    return gulp.src(jsFiles)
    .pipe(concat(jsFileName))
    .pipe(frep(newLinePattern))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest(jsOutputDir))
    .on(taskFinishEvt, log.bind(jsOutputMessage));
});

gulp.task('clean', function() {
    return gulp.src([ 'public/build/**'
                    ], {read: false})
    .pipe(clean());
});

var thirdPartyJSFiles = [
    'public/plugin/angular/angular.js',
    'public/plugin/angular-animate/angular-animate.js',
    'public/plugin/angular-aria/angular-aria.js',
    'public/plugin/angular-bootstrap/ui-bootstrap.js',
    'public/plugin/angular-bootstrap/ui-bootstrap-tpls.js',
    'public/plugin/angular-cookies/angular-cookies.js',
    'public/plugin/angular-messages/angular-messages.js',
    'public/plugin/angular-resource/angular-resource.js',
    'public/plugin/angular-sanitize/angular-sanitize.js',
    'public/plugin/angular-ui-grid/ui-grid.min.js',
    'public/plugin/angular-ui-router/release/angular-ui-router.js',
    'public/plugin/jQuery/dist/jquery.js',
    'public/plugin/bootstrap/dist/js/bootstrap.js'
];

var thirdPartyJSFileName = 'thirdparty.js';
var thirdPartyJSOutputDir = path.join(emoviatoRoot, 'public', 'build', 'js');
var thirdPartyJSOutputMessage = 'Task: "3pjs" created ' + path.join(thirdPartyJSOutputDir, thirdPartyJSFileName);
gulp.task('3pjs', function() {
    return gulp.src(thirdPartyJSFiles)
    .pipe(concat(thirdPartyJSFileName))
    .pipe(frep(newLinePattern))
    .pipe(gulp.dest(thirdPartyJSOutputDir))
    .on(taskFinishEvt, log.bind(thirdPartyJSOutputMessage));
});

var fontAssets = [
    'public/plugin/bootstrap/fonts/*',
    'public/plugin/components-font-awesome/fonts/*'
    //Other non-bootstrap specific font asset directories (for example when we add font-awesome icons)
];
var fontsOutputDir = path.join(emoviatoRoot, 'public', 'styles', 'fonts');
var fontsOutputMessage = 'Task: "copy:fonts" created ' + fontsOutputDir;
gulp.task('copy:fonts', function() {
    return gulp.src(fontAssets)
    .pipe(gulp.dest(fontsOutputDir))
    .on(taskFinishEvt, log.bind(fontsOutputMessage));
});


gulp.task('3pjs-ugly', function() {
    return gulp.src(thirdPartyJSFiles)
    .pipe(concat(thirdPartyJSFileName))
    .pipe(frep(newLinePattern))
    .pipe(uglify())
    .pipe(gulp.dest(thirdPartyJSOutputDir))
    .on('error', sass.logError, taskFinishEvt, log.bind(thirdPartyJSOutputMessage));
});

var sassFilename = 'emoviato_styles.scss';
var sassOutputPath = path.join(emoviatoRoot, 'public', 'styles', 'css');
var sassOutputMessage = 'Task: "sass" created ' + path.join(sassOutputPath, sassFilename);
//App.css should always be last, for overrides.
gulp.task('sass', function() {
    sass('public/styles/css/emoviato_styles.scss', {
      cacheLocation: 'public/styles/css/sass_cache'
    })
    .pipe(gulp.dest(sassOutputPath))
    .on(taskFinishEvt, log.bind(sassOutputMessage));
});

var cssFilename = 'gulpstyles.css';
var cssOutputPath = path.join(emoviatoRoot, 'public', 'styles', 'css');
var cssOutputMessage = 'Task: "css" created ' + path.join(cssOutputPath, cssFilename);
//ccApp.css should always be last, for overrides.
gulp.task('css', function() {
    return gulp.src([
        //TODO: check the plugins to see if there are more thirdparty css files to add to this list.
        'public/plugin/angular-ui-grid/ui-grid.min.css',
        'public/plugin/angular-bootstrap/angular-bootstrap-csp.css',
        'public/plugin/components-font-awesome/css/font-awesome.css',
        'public/plugin/angular-motion/dist/angular-motion.css',
        'public/plugin/bootstrap/dist/css/bootstrap.css'
    ])
    .pipe(concat(cssFilename))
    .pipe(frep(newLinePattern))
    .pipe(gulp.dest(cssOutputPath))
    .on(taskFinishEvt, log.bind(cssOutputMessage));
});


var es6Files = [
    'server/**/*.js',
    '!server/node_modules/**/*'
];
gulp.task('eslint', function() {
    return gulp.src(es6Files)
        .pipe(eslint({configFile: path.join(__dirname,'.eslintrc.js')}))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});


var lintFiles = [
    'public/app/**/*.js'
];

var lintSuccessMessage = 'Task "lint" complete: Congrats! No jshint Errors.';
gulp.task('lint', ['eslint'], function() {
    return gulp.src(lintFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .on(taskFinishEvt, log.bind(lintSuccessMessage));
});

var stylePath = path.join(emoviatoRoot, 'public', 'styles', 'css');


gulp.task('watch', ['js','sass'], function () {
    gulp.watch('public/app/**/*.js',['js']);
    gulp.watch('public/styles/css/emoviato_styles.scss', ['sass']);
});
gulp.task('fullbuild', ['copy:fonts', 'css','sass', 'js', '3pjs', 'lint']);
gulp.task('fullbuildprod', ['copy:fonts', 'css', 'sass', 'js-ugly', '3pjs-ugly', 'lint']);
