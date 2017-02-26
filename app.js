require('marko/node-require').install();

var express = require('express'),
	app = express(),
	path = require('path'),
	gulp = require('gulp'),
	root = "src",
	fs = require('fs'),
	marko = require('marko');

app.use(express.static("src"));

/*
['gulp-tasks'].map((controllerName) => {
  controller = require('./' + controllerName);
  controller.setup(app);
});
*/

[
	'feats/feats'
].map((controllerName) => {
  controller = require('./routes/' + controllerName);
  controller.setup(app, marko, fs, path, root);
});

/*
app.get('/dot', function(req, res) {
	var dots = dot.process({path: "./src"});
      dots.mytemplate({foo:"hello world"});
});
*/
/*


app.get('/races', function(req, res) {
	res.sendFile(path.join(__dirname+root+'/index.html'));
});
*/

//gulp.start("build");
app.listen(82);
