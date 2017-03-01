var express = require('express'),
	app = express(),
	//gulpTasks = require('./gulp-tasks'),
	gulp = require('gulp');

app.use(express.static("src"));

[
	['routes', 'feats']
].map((controllerName) => {
  controller = require('./routes/' + controllerName[0]);
  controller.setup(app, controllerName[1]);
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
app.listen(80);