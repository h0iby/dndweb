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
		templateHead = path.join(__dirname+''+htmlTemplatesPath+'/head.html'),
		templatePage = path.join(__dirname+''+htmlTemplatesPath+'/index.html');

	var fileMenu = fs.readFileSync(templateMenu).toString(),
		fileMenuLevel1 = fs.readFileSync(templateMenuLevel1).toString(),
		fileMenuLevel1Children = fs.readFileSync(templateMenuLevel1Children).toString(),
		fileMenuLevel2 = fs.readFileSync(templateMenuLevel2).toString(),
		fileHead = fs.readFileSync(templateHead).toString(),
		filePage = fs.readFileSync(templatePage).toString();


	var templateHead = path.join(__dirname+''+htmlTemplatesPath+'/head.html');
	var fileHead = fs.readFileSync(templateHead).toString();

	var htmlReplacements = function(input, main, alias, path, data, robots, title, description, keywords, url, type){
		var output = input;
		if(alias == null || alias == undefined){ alias = ""; }
		if(path == null || path == undefined){ path = ""; }
		if(robots == null || robots == undefined){ robots = "noindex follow"; }
		if(title == null || title == undefined){ title = "D&amp;D"; }
		if(description == null || description == undefined){ description = "D&amp;D Database"; }
		if(keywords == null || keywords == undefined){ keywords = "D&amp;D, DnD, dndtools, feats, spells, classes"; }
		if(url == null || url == undefined){ url = ""; }
		if(type == null || type == undefined){ type = ""; }

		output = output.replace("#MAIN#", main);
		output = output.replace("#LOADDATA#", data);
		output = output.replace("#MENUITEM#", alias);
		output = output.replace("#MENUENDPOINT#", path);
		output = output.replace("#ROBOTS#", robots);

		output = output.replace("#PAGETITLE#", title);
		output = output.replace("#METATITLE#", title);
		output = output.replace("#OGTITLE#", title);
		output = output.replace("#TWITTERTITLE#", title);
		output = output.replace("#PROPTITLE#", title);

		output = output.replace("#METADESCRIPTION#", description);
		output = output.replace("#PROPDESCRIPTION#", description);
		output = output.replace("#OGDESCRIPTION#", description);
		output = output.replace("#TWITTERDESCRIPTION#", description);
		output = output.replace("#TWITTERCARD#", description);

		output = output.replace("#METAKEYWORDS#", keywords);

		output = output.replace("#OGURL#", url);
		output = output.replace("#CANNONICAL#", url);

		output = output.replace("#OGTYPE#", type);

		return output;
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
			var current = html,
				pathMain = '' + item.path.replace(':id', 'id') + '.html',
				templateMain = path.join(__dirname+''+htmlDatabasePath+'/endpoints' + pathMain + ''),
				fileMain = fs.readFileSync(templateMain).toString();

			current = current.replace("#HEAD#", fileHead).replace("#MAIN#", fileMain);
			paths.push([item, current]);
		}
	});
	paths.map((controllerName) => {
	  controller = require('./routes/database');
	  controller.setup(app, controllerName[0], controllerName[1]);
	});

	// create endpoint for database
	console.log("Registering endpoint: /database");
	app.get('/database', (req, res) => {
		var current = html;
		var templateMain = path.join(__dirname+''+htmlDatabasePath+'/database.html');
		var fileMain = fs.readFileSync(templateMain).toString();

		var repData = true,
			repAlias = null,
			repPath = null,
			repRobots = "index follow",
			repTitle = "D&amp;D: Database",
			repDescription = "D&amp;D Database",
			repKeywords = "",
			repUrl = "",
			repType = "";

		current = current.replace("#HEAD#", fileHead);
		current = htmlReplacements(current, fileMain, repAlias, repPath, repData, repRobots, repTitle, repDescription, repKeywords, repUrl, repType);
		res.send(current);
	});

	// create endpoint for search
	console.log("Registering endpoint: /search");
	app.get('/search', (req, res) => {
		var current = html;
		var templateMain = path.join(__dirname+''+htmlPagesPath+'/default.html');
		var fileMain = fs.readFileSync(templateMain).toString();

		var repData = true,
			repAlias = null,
			repPath = null,
			repRobots = "noindex follow",
			repTitle = "D&amp;D: Search",
			repDescription = "Search for D&amp;D feats, classes, spells and more here.",
			repKeywords = "D&amp;D, DnD, dndtools, feats, spells, classes",
			repUrl = "/search",
			repType = "search";

		current = current.replace("#HEAD#", fileHead);
		current = htmlReplacements(current, fileMain, repAlias, repPath, repData, repRobots, repTitle, repDescription, repKeywords, repUrl, repType);
		res.send(current);
	});

	// create endpoint for home
	console.log("Registering endpoint: /");
	app.get('/', (req, res) => {
		var current = html;
		var templateMain = path.join(__dirname+''+htmlPagesPath+'/default.html');
		var fileMain = fs.readFileSync(templateMain).toString();

		var repData = false,
			repAlias = null,
			repPath = null,
			repRobots = "index follow",
			repTitle = "D&amp;D",
			repDescription = "",
			repKeywords = "",
			repUrl = "",
			repType = "";

		current = current.replace("#HEAD#", fileHead);
		current = htmlReplacements(current, fileMain, repAlias, repPath, repData, repRobots, repTitle, repDescription, repKeywords, repUrl, repType);
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

			var repData = false,
				repAlias = null,
				repPath = null,
				repRobots = "noindex follow",
				repTitle = "D&amp;D: Page not found (Error " + err.status + ")",
				repDescription = "Error page",
				repKeywords = "",
				repUrl = "",
				repType = "error";

			current = current.replace("#HEAD#", fileHead);
			current = htmlReplacements(current, fileMain, repAlias, repPath, repData, repRobots, repTitle, repDescription, repKeywords, repUrl, repType);
			res.send(current);
		});
	}
	// error handling - production
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		var current = html;
		var templateMain = path.join(__dirname+''+htmlErrorsPath+'/'+err.status+'.html');
		var fileMain = fs.readFileSync(templateMain).toString();

		var repData = false,
			repAlias = null,
			repPath = null,
			repRobots = "noindex follow",
			repTitle = "D&amp;D: Page not found (Error "+ err.status +")",
			repDescription = "",
			repKeywords = "",
			repUrl = "",
			repType = "";

		current = current.replace("#HEAD#", fileHead);
		current = htmlReplacements(current, fileMain, repAlias, repPath, repData, repRobots, repTitle, repDescription, repKeywords, repUrl, repType);
		res.send(current);
	});





	// start gulp for assets and start server
	//gulp.start("build");
	app.listen(82);
}





// service request - with callback when done.
var serviceRequest = function(){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (this.readyState === 4) { serviceCallback(this.responseText); }
	};
	xhr.open("GET", "http://localhost:81/endpoints");
	xhr.send();
}



// start service request to get endpoints from webservice
serviceRequest();