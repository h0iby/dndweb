"use strict";

console.time("Require");

// modules
var gulp = require("gulp"),
	debug = require('gulp-debug'),
	del = require('del'),
	postcss = require('gulp-postcss'),
	postcssimport = require("postcss-import"),
	postcssurl = require("postcss-url"),
	postcsscssnext = require("postcss-cssnext"),
	postcssbrowserreporter = require("postcss-browser-reporter"),
	cssmqpacker = require("css-mqpacker"),
	cssnano = require("cssnano"),
	spritesmith = require('gulp.spritesmith'),
	buffer = require('vinyl-buffer'),
	imagemin = require('gulp-imagemin'),
    plugins = require("gulp-load-plugins")({ camelize: true }),
	browserSync = require("browser-sync"),
	reload = browserSync.reload;


console.timeEnd("Require");



// uglify
var uglifyOptions =
{
	mangle: false,
	compress:
	{
		global_defs:
		{
			DEBUG: false
		}
	}
};
// /////////////////////////////////////////



// folders
var Folders =
{
	root: "src",
	source: {
		main: "src/__resources",
		styles: "src/__resources/css",
		scripts: "src/__resources/scripts",
		sprites: "src/__resources/sprites",
	},
	target: {
		main: "src/_assets",
		styles: "src/_assets/css",
		scripts: "src/_assets/scripts",
		sprites: "src/_assets/sprites",
	},
	settings: {
		sprites: "_assets/sprites"
	}
};
// /////////////////////////////////////////



// Default task to be run with `gulp`
gulp.task("default", ["styles", "scripts", "browser-sync", "watch-build", "watch-sync"]);
// /////////////////////////////////////////



// build task
gulp.task("build", ["styles", "scripts", "sprites", "watch-build"]);
// /////////////////////////////////////////



// watch task - sync
gulp.task("watch-sync", function()
{
	gulp.watch(Folders.target.styles + "/*.css", browserSync.reload);
	gulp.watch(Folders.target.scripts + "/*.js", browserSync.reload);
	gulp.watch(Folders.root + "/*.html", browserSync.reload);
	gulp.watch(Folders.root + "/**/*.html", browserSync.reload);
});
// /////////////////////////////////////////
// watch task - build
gulp.task("watch-build", function()
{
	gulp.watch(Folders.source.styles + "/**/*.*", ["styles"]);
	gulp.watch(Folders.source.scripts + "/**/*.*", ["scripts"]);
});
// /////////////////////////////////////////



// css
gulp.task("styles", ["css", "css-print"]);
// /////////////////////////////////////////

// css general
gulp.task("css", function () {
	return (
	gulp.src(Folders.source.styles + "/main.css")
		.pipe(postcss([
			postcssimport(),
			postcssurl(),
			postcsscssnext(),
			cssmqpacker(),
			cssnano()
		]))
		.pipe(gulp.dest(Folders.target.styles))
	)
});
// css print
gulp.task("css-print", function () {
	return (
	gulp.src(Folders.source.styles + "/print.css")
		.pipe(postcss([
			postcssimport(),
			postcssurl(),
			postcsscssnext()
		]))
		.pipe(gulp.dest(Folders.target.styles))
	)
});
// /////////////////////////////////////////



// js
gulp.task("scripts", ["js"]);
// /////////////////////////////////////////

// js general
gulp.task("js", function () {
	return gulp
		.src(Folders.source.scripts + "/main.js")
		.pipe(plugins.rename({ suffix: "" }))
		.pipe(plugins.include())
		//.pipe(plugins.uglify())
		.on("error", plugins.notify.onError(function (error) {
			return error.message;
		}))
		.on("error", function (err) {
			this.emit("end");
		})
		.pipe(gulp.dest(Folders.target.scripts));
});
// /////////////////////////////////////////



// sprites
gulp.task("sprites", ["sprite-global@1x", "sprite-global@2x"]);
// /////////////////////////////////////////

// sprites global 1x
gulp.task("sprite-global@1x", function () {
	// Generate our spritesheet
	var spriteData = gulp.src(Folders.source.sprites + "/*@1x.png").pipe(spritesmith({
		algorithm: "top-down",
		imgName: '/' + Folders.settings.sprites + '/sprite@1x.png',
		cssFormat: "less",
		cssTemplate: "sprite@2.mustache",
		cssName: '_sprites-auto.less',
		cssVarMap: function (sprite) {
			sprite.name = 'sprite-' + sprite.name.replace("@1x", "");
		}
	}));

	var imgStream = spriteData.img
		.pipe(buffer())
		.pipe(imagemin())
		.pipe(gulp.dest(Folders.target.sprites));

	var cssStream = spriteData.css
		.pipe(gulp.dest(Folders.source.styles + "/sprites"))
});
// sprites global 2x
gulp.task("sprite-global@2x", function () {
	// Generate our spritesheet
	var spriteData = gulp.src(Folders.source.sprites + "/*@2x.png").pipe(spritesmith({
		algorithm: "top-down",
		imgName: '/' + Folders.settings.sprites + '/sprite@1x.png',
		cssFormat: "css",
		cssName: 'sprite@2x.css',
	}));

	var imgStream = spriteData.img
		.pipe(buffer())
		.pipe(imagemin())
		.pipe(gulp.dest(Folders.target.sprites));
});
// /////////////////////////////////////////





// live sync and reload
gulp.task("browser-sync", function()
{
	browserSync(
	{
		notify: false,
		ghostMode: false,
		snippetOptions:
		{
			blacklist: [ "/map/**" ]
		},
		server:
		{
			baseDir: Folders.root
		}
	});
});