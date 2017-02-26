var express = require('express'),
	app = express(),
	gulp = require('gulp');

[
    'gulp-tasks'
].map((controllerName) => {
  controller = require('./' + controllerName);
  controller.setup(app);
});

gulp.start("default");