let gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass')(require('sass')),
    rigger = require('gulp-rigger'),
    browserSync = require("browser-sync"),
    plumber = require("gulp-plumber"),
    cssmin = require("gulp-cssmin"),
    jsmin = require("gulp-uglify-es").default,
    notify = require("gulp-notify"),
    fileInclude = require('gulp-file-include'),
    version = require('gulp-version-number'),
    reload = browserSync.reload;

let host;

let path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    dev: {
        html: 'dev/',
        js: 'dev/js/',
        css: 'dev/css/',
        img: 'dev/img/',
        fonts: 'dev/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/*.js',
        css: 'src/css/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        css: 'src/css/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
    },
    clean: {
        build: './build',
        dev: './dev'
    }
};

const versionConfig = {
    'value': '%MDS%',
    'append': {
        'key': 'v',
        'to': ['css', 'js'],
    },
};

let osbrowser;

if (process.platform === 'darwin') {
    osbrowser = "google chrome";
} else if (process.platform === 'win32') {
    osbrowser = "chrome";
}

let config;
if (host === undefined) {
    config = {
        server: {
            baseDir: "./dev"
        },
        browser: osbrowser,
        host: 'localhost',
        notify: false,
    };
} else {
    config = {
        browser: osbrowser,
        host: host,
        proxy: host,
        notify: false,
    };
}

function webserver() {
    browserSync(config);
}

let local_path;
function html() {
    switch (local_path) {
        case 'build':
            return gulp.src(path.src.html)
                .pipe(rigger())
                .pipe(fileInclude())
                .pipe(gulp.dest(path.build.html));
        case 'dev':
            return gulp.src(path.src.html)
                .pipe(rigger())
                .pipe(fileInclude())
                .pipe(version(versionConfig))
                .pipe(gulp.dest(path.dev.html))
                .pipe(reload({stream: true}));
        default:
            console.log(false);
            break;
    }
}

function css() {
    switch (local_path) {
        case 'build':
            return gulp.src(path.src.css)
                .pipe(plumber())
                .pipe(sass({
                    includePaths: ['src/css/'],
                }))
                .pipe(cssmin())
                .pipe(prefixer())
                .pipe(gulp.dest(path.build.css));
        case 'dev':
            return gulp.src(path.src.css)
                .pipe(sass({outputStyle: 'expanded' , sourceMap: true}).on("error", notify.onError()))
                .pipe(prefixer())
                .pipe(version(versionConfig))
                .pipe(gulp.dest(path.dev.css))
                .pipe(reload({stream: true}));
        default:
            console.log(false);
            break;
    }
}

function js() {
    switch (local_path) {
        case 'build':
            return gulp.src(path.src.js)
                .pipe(plumber())
                .pipe(rigger())
                .pipe(jsmin())
                .pipe(gulp.dest(path.build.js));
        case 'dev':
            return gulp.src(path.src.js)
                .pipe(plumber())
                .pipe(rigger())
                .pipe(version(versionConfig))
                .pipe(gulp.dest(path.dev.js))
                .pipe(reload({stream: true}));
        default:
            console.log(false);
            break;
    }
}

function img() {
    switch (local_path) {
        case 'build':
            return gulp.src(path.src.img)
                .pipe(gulp.dest(path.build.img));
        case 'dev':
            return gulp.src(path.src.img)
                .pipe(gulp.dest(path.dev.img))
                .pipe(reload({stream: true}));
        default:
            console.log(false);
            break;
    }
}

function fonts() {
    switch (local_path) {
        case 'build':
            return gulp.src(path.src.fonts)
                .pipe(gulp.dest(path.build.fonts));
        case 'dev':
            return gulp.src(path.src.fonts)
                .pipe(gulp.dest(path.dev.fonts));
        default:
            console.log(false);
            break;
    }
}

function build(done) {
    local_path = 'build';
    done();
}

function dev(done) {
    local_path = 'dev';
    done();
}

function watch() {
    gulp.watch([path.watch.html], gulp.parallel(dev, html));
    gulp.watch([path.watch.css], gulp.parallel(dev, css));
    gulp.watch([path.watch.js], gulp.parallel(dev, js));
    gulp.watch([path.watch.img], gulp.parallel(dev, img));
    gulp.watch([path.watch.fonts], gulp.parallel(dev, fonts));
}

exports.build = gulp.parallel(build, html, css, js, img, fonts);
exports.dev = gulp.parallel(dev, html, css, js, img, fonts);

gulp.task('default', gulp.series(dev, html, css, js, img, fonts, gulp.parallel(webserver, watch)));