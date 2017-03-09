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
		html = "";

	var templateMenu = path.join(__dirname+'/src/_default/db-menu.html'),
		templateMenuLevel1 = path.join(__dirname+'/src/_default/db-menu-level1.html'),
		templateMenuLevel1Children = path.join(__dirname+'/src/_default/db-menu-level1-children.html'),
		templateMenuLevel2 = path.join(__dirname+'/src/_default/db-menu-level2.html'),
		templatePage = path.join(__dirname+'/src/_default/index.html');

	var fileMenu = fs.readFileSync(templateMenu).toString(),
		fileMenuLevel1 = fs.readFileSync(templateMenuLevel1).toString(),
		fileMenuLevel1Children = fs.readFileSync(templateMenuLevel1Children).toString(),
		fileMenuLevel2 = fs.readFileSync(templateMenuLevel2).toString(),
		filePage = fs.readFileSync(templatePage).toString();


	//create the menu structure for database
	jsonData.forEach(function(item, i){
		if(item.show == '/'){
			var current = "";
			if(item.children){ current = fileMenuLevel1Children; }
			else { current = fileMenuLevel1; }
			current = current.replace("#MENUNAME#", item.menu).replace("#MENUPATH#", item.path);
			fileMenu = fileMenu.replace("#LEVEL1#", current + " #LEVEL1#");
		} else if(item.show != ''){
			var current = fileMenuLevel2;
			current = current.replace("#MENUNAME#", item.menu).replace("#MENUPATH#", item.path);
			fileMenu = fileMenu.replace("#LEVEL2#", current);
		}
	});
	fileMenu = fileMenu.replace("#LEVEL1#", "");
	html = filePage.replace("#DBMENU#", fileMenu);





	// create endpoints for data
	jsonData.forEach(function(item, i){
		if(item.render){
			var current = html;
			var htmlPath = item.path.replace(":id", "id");
			var templateMain = path.join(__dirname+'/src/_templates/' + htmlPath + ".html");
			var fileMain = fs.readFileSync(templateMain).toString();
			current = current.replace("#MAIN#", fileMain);
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
		var templateMain = path.join(__dirname+'/src/_templates/_database.html');
		var fileMain = fs.readFileSync(templateMain).toString();
		current = current.replace("#MAIN#", fileMain);
		res.send(current);
	});



	// create endpoint for home
	app.get('/', (req, res) => {
		var current = html;
		var templateMain = path.join(__dirname+'/src/_templates/_default.html');
		var fileMain = fs.readFileSync(templateMain).toString();
		current = current.replace("#MAIN#", fileMain);
		res.send(current);
	});



	// create static endpoints for assets and such
	app.use(express.static("src"));



	// start gulp for assets and start server
	//gulp.start("build");
	app.listen(81);
}


var serviceRequest = function(){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (this.readyState === 4) { serviceCallback(this.responseText); }
	};
	xhr.open("GET", "http://localhost:80/endpoints");
	xhr.send();
}

serviceRequest();