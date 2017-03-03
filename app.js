var express = require('express'),
	app = express(),
	path = require('path'),
	XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
	gulp = require('gulp');
	//gulpTasks = require('./gulp-tasks'),

app.use(express.static("src"));

var serviceCallback = function(data){
	var jsonData = JSON.parse(data);
	var paths = [];

	jsonData.forEach(function(item, i){
		if(item.guid != true){
			paths.push(["routes", item, data]);
		}
	});

	paths.map((controllerName) => {
	  controller = require('./routes/' + controllerName[0]);
	  controller.setup(app, controllerName[1], controllerName[2]);
	});

	//gulp.start("build");
	app.listen(80);
}

var serviceRequest = function(){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (this.readyState === 4) { serviceCallback(this.responseText); }
	};
	xhr.open("GET", "http://localhost:81/endpoints");
	xhr.send();
}

serviceRequest();