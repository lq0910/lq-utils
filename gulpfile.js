"use strict";
const { watch, series } = require('gulp');
//******************************************************************************
//* DEPENDENCIES
//******************************************************************************
var gulp = require("gulp"),
    tslint = require("gulp-tslint"),
    tsc = require("gulp-typescript"),
    // mocha = require("gulp-mocha"),
    // istanbul = require("gulp-istanbul"),
    browserSync = require('browser-sync').create();

var dist = "dist/";
exports.default = series(lint, build_ts);
exports.pub = series(lint, build_ts, copy_for_npm);
function lint() {
    var config = { extends: "tslint:recommended", formatter: "verbose", emitError: (process.env.CI) ? true : false };

    return gulp.src([
        "src/**/**.ts",
        "test/**/**.test.ts"
    ])
        .pipe(tslint(config))
        .pipe(tslint.report());
}
//******************************************************************************
//* BUILD TEST
//******************************************************************************
// var tsTestProject = tsc.createProject("tsconfig.json");


// function hook(cb) {
//     return gulp.src(['src/**/*.js'])
//         // Covering files
//         .pipe(istanbul())
//         // Force `require` to return covered files
//         .pipe(istanbul.hookRequire());
// }
// function test(hook, cb) {
//     return gulp.src('test/**/*.test.js')
//         .pipe(mocha({ ui: 'bdd' }))
//         .pipe(istanbul.writeReports());
// }

var ts = tsc.createProject("tsconfig.json");
function build_ts() {

    return gulp.src([
        "src/**/**.ts",
        "test/**/*.ts"], { base: "." }
    ).pipe(ts()).pipe(gulp.dest('.'));

    // return gulp.src([
    //     "src/**/**.ts",
    //     "test/**/*.ts"],
    //     { base: "." }
    // ).pipe(ts())
    //     .on("error", function (err) {
    //         process.exit(1);
    //     }).js
    //     .pipe(gulp.dest("."));

}
function build_static(cb) {

    gulp.src(["src/**/*.html"]).pipe(gulp.dest(dist + "src/"));
    gulp.src("css/**/*.*").pipe(gulp.dest(dist + "css/"));
    gulp.src(["*.html", "!index.html"]).pipe(gulp.dest(dist));
    cb();
}
function copy_libs(cb) {

    gulp.src("js/**/*.*").pipe(gulp.dest(dist + "js/"));
    gulp.src("img/**/*.*").pipe(gulp.dest(dist + "img/"));
    cb();
}

function run_app(cb) {
    browserSync.init({
        server: {
            baseDir: "dist",
            index: "index_mob.html"
        }
    });

    watch(["src/**/**.ts", "test/**/*.ts"], series(build_ts, cache, reload));
    //gulp.watch("dist/*.js").on('change', browserSync.reload);
    gulp.watch(['*.html', 'src/**/*.html', 'css/**/*.css'], series(build_static, cache, reload));

    gulp.watch(['img/**/*', 'js/**/*'], series(copy_libs, cache, reload));
    // gulp.watch(['src/**/*.js'], browserSync.reload);
    cb();
}
function reload(cb) {
    console.log("reload....");

    browserSync.reload();
    //browserSync.reload();
    cb();
    console.log("reloaded...");
}

function copy_for_npm(cb) {
    var dist = "dist/";
    gulp.src("src/utils.js").pipe(gulp.dest(dist));
    gulp.src("src/*.d.ts").pipe(gulp.dest(dist));
    //gulp.src(['env_config.js', 'config.js']).pipe(concat('config.js')).pipe(gulp.dest(dist))
    // gulp.src("src/**/*.html").pipe(gulp.dest(dist + "src/"));
    // gulp.src("src/**/*.js").pipe(gulp.dest(dist + "src/"));
    cb();
}
