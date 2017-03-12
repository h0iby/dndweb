var express = require('express'),
	app = express(),
	path = require('path'),
	XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
	fs = require('fs'),
	gulp = require('gulp');
	//gulpTasks = require('./gulp-tasks'),



var serviceCallback = function(data){
	var jsonData = JSON.parse(data),
		paths = [],
		htmlPath = "/__resources/html",
		htmlErrorsPath = htmlPath + "/pages/errors",
		htmlTemplatesPath = htmlPath + "/templates",
		htmlMenuPath = htmlPath + "/templates/menu",
		htmlPagesPath = htmlPath + "/pages",
		htmlDatabasePath = htmlPath + "/pages/database",
		html = "";

	var templateMenu = path.join(__dirname+''+htmlMenuPath+'/db-menu.html'),
		templateMenuLevel1 = path.join(__dirname+''+htmlMenuPath+'/db-menu-level1.html'),
		templateMenuLevel1Children = path.join(__dirname+''+htmlMenuPath+'/db-menu-level1-children.html'),
		templateMenuLevel2 = path.join(__dirname+''+htmlMenuPath+'/db-menu-level2.html'),
		templatePage = path.join(__dirname+''+htmlTemplatesPath+'/index.html');

	var fileMenu = fs.readFileSync(templateMenu).toString(),
		fileMenuLevel1 = fs.readFileSync(templateMenuLevel1).toString(),
		fileMenuLevel1Children = fs.readFileSync(templateMenuLevel1Children).toString(),
		fileMenuLevel2 = fs.readFileSync(templateMenuLevel2).toString(),
		filePage = fs.readFileSync(templatePage).toString();

	var htmlReplacements = function(input, main, alias, path, robots){
		var output = input;
		if(alias == null || alias == undefined){ alias = ""; }
		if(path == null || path == undefined){ path = ""; }
		if(robots == null || robots == undefined){ robots = "noindex follow"; }

		output = output.replace("#MAIN#", main);
		output = output.replace("#MENUITEM#", alias);
		output = output.replace("#MENUENDPOINT#", path);
		if(robots != ""){ output = output.replace("#ROBOTS#", robots); }

		return output;
	}

	var replaceFunction = function(input, replaceFrom, replaceTo){
		var output = input.replace(replaceFrom, replaceTo);

		if(input.indexOf(replaceFrom) > -1){
			replaceFunction(output, replaceFrom, replaceTo);
		} else {
			return output;
		}
	}



	//create the menu structure for database
	jsonData.forEach(function(item, i){
		var name = item.menu;
		var alias = item.alias;
		if(item.render){
			if(item.show == '/'){
				fileMenu = fileMenu.replace("#LEVEL2#", "");
				var current = fileMenuLevel1;
				if(item.children){ current = fileMenuLevel1Children }
				current = current.replace("#MENUNAME#", name).replace("#MENUCLASS#", alias).replace("#MENUPATH#", item.path);
				fileMenu = fileMenu.replace("#LEVEL1#", current + " #LEVEL1#");
			} else if(item.show != ''){
				var current = fileMenuLevel2;
				current = current.replace("#MENUNAME#", name).replace("#MENUCLASS#", alias).replace("#MENUPATH#", item.path);
				fileMenu = fileMenu.replace("#LEVEL2#", current + "#LEVEL2#");
			}
		}
	});
	fileMenu = fileMenu.replace("#LEVEL1#", "").replace("#LEVEL2#", "");
	html = filePage.replace("#DBMENU#", fileMenu);







	// create endpoints for data
	jsonData.forEach(function(item, i){
		if(item.render){
			var current = html;
			var alias = item.alias;
			var currentPath = item.path.replace(":id", "id");
			var templateMain = path.join(__dirname+''+htmlDatabasePath+'/endpoints/' + currentPath + ".html");
			var fileMain = fs.readFileSync(templateMain).toString();
			current = htmlReplacements(current, fileMain, alias, item.path, "");
			paths.push([item, current]);
		}
	});
	paths.map((controllerName) => {
	  controller = require('./routes/database');
	  controller.setup(app, controllerName[0], controllerName[1], controllerName[2]);
	});

	// create endpoint for database
	app.get('/database', (req, res) => {
		var current = html;
		var templateMain = path.join(__dirname+''+htmlDatabasePath+'/database.html');
		var fileMain = fs.readFileSync(templateMain).toString();
		current = htmlReplacements(current, fileMain, null, null, "index follow");
		res.send(current);
	});

	// create endpoint for home
	app.get('/', (req, res) => {
		var current = html;
		var templateMain = path.join(__dirname+''+htmlPagesPath+'/default.html');
		var fileMain = fs.readFileSync(templateMain).toString();
		current = htmlReplacements(current, fileMain, null, null, "index follow");
		res.send(current);
	});

	// create static endpoints for assets and such
	app.use(express.static("src"));

	// error handling
	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});
	// error handling - development
	if (app.get('env') === 'development') {
		app.use(function(err, req, res, next) {
			res.status(err.status || 500);
			var current = html;
			var templateMain = path.join(__dirname+''+htmlErrorsPath+'/'+err.status+'.html');
			var fileMain = fs.readFileSync(templateMain).toString();
			current = htmlReplacements(current, fileMain, null, null, null);
			res.send(current);
		});
	}
	// error handling - production
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		var current = html;
		var templateMain = path.join(__dirname+''+htmlErrorsPath+'/'+err.status+'.html');
		var fileMain = fs.readFileSync(templateMain).toString();
		current = htmlReplacements(current, fileMain, null, null, null);
		res.send(current);
	});





	// start gulp for assets and start server
	//gulp.start("build");
	app.listen(81);
}





// service request - with callback when done.
var serviceRequest = function(){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (this.readyState === 4) { serviceCallback(this.responseText); }
	};
	xhr.open("GET", "http://localhost:80/endpoints");
	xhr.send();
}



// start service request to get endpoints from webservice
serviceRequest();