var express = require('express')
	,serverPath = "http://localhost:81"
	,app = express()
	,path = require('path')
	,XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
	,fs = require('fs')
	,http = require('http')
	,https = require('https')
	,gulp = require('gulp')
	,gulpTasks = require('./gulp-tasks')
	;



var serviceCallback = function(data){
	var jsonData = JSON.parse(data),
		paths = [],
		htmlPath = "/__resources/html",
		htmlErrorsPath = htmlPath + "/pages/errors",
		htmlTemplatesPath = htmlPath + "/templates",
		htmlMenuPath = htmlPath + "/templates/menu",
		htmlPagesPath = htmlPath + "/pages",
		html = "";

	var templateMenu = path.join(__dirname+''+htmlMenuPath+'/db-menu.html'),
		templateMenuLevel1 = path.join(__dirname+''+htmlMenuPath+'/db-menu-level1.html'),
		templateMenuLevel1Children = path.join(__dirname+''+htmlMenuPath+'/db-menu-level1-children.html'),
		templateMenuLevel2 = path.join(__dirname+''+htmlMenuPath+'/db-menu-level2.html'),
		templateHead = path.join(__dirname+''+htmlTemplatesPath+'/head.html'),
		templateFooter = path.join(__dirname+''+htmlTemplatesPath+'/footer.html'),
		templateLogo = path.join(__dirname+''+htmlTemplatesPath+'/logo.html'),
		templateSearch = path.join(__dirname+''+htmlTemplatesPath+'/search.html'),
		templateOverlay = path.join(__dirname+''+htmlTemplatesPath+'/overlay.html'),
		templatePaging = path.join(__dirname+''+htmlTemplatesPath+'/paging.html'),
		templatePage = path.join(__dirname+''+htmlTemplatesPath+'/index.html');

	var fileMenu = fs.readFileSync(templateMenu).toString(),
		fileMenuLevel1 = fs.readFileSync(templateMenuLevel1).toString(),
		fileMenuLevel1Children = fs.readFileSync(templateMenuLevel1Children).toString(),
		fileMenuLevel2 = fs.readFileSync(templateMenuLevel2).toString(),
		fileHead = fs.readFileSync(templateHead).toString(),
		fileFooter = fs.readFileSync(templateFooter).toString(),
		fileLogo = fs.readFileSync(templateLogo).toString(),
		fileSearch = fs.readFileSync(templateSearch).toString(),
		fileOverlay = fs.readFileSync(templateOverlay).toString(),
		filePaging = fs.readFileSync(templatePaging).toString(),
		filePage = fs.readFileSync(templatePage).toString();

	html = filePage;

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
				if(item.children > 0){ current = fileMenuLevel1Children }
				current = current.replace("#MENUNAME#", name).replace("#MENUCLASS#", alias).replace("#MENUPATH#", item.path);
				fileMenu = fileMenu.replace("#LEVEL1#", current + " #LEVEL1#").replace("#MENUCHILDREN#", item.children);
			} else if(item.show != ''){
				var current = fileMenuLevel2;
				current = current.replace("#MENUNAME#", name).replace("#MENUCLASS#", alias).replace("#MENUPATH#", item.path);
				fileMenu = fileMenu.replace("#LEVEL2#", current + "#LEVEL2#");
			}
		}
	});
	fileMenu = fileMenu.replace("#LEVEL1#", "").replace("#LEVEL2#", "");

	// standard replacements
	html = html.replace("#MENU#", fileMenu);
	html = html.replace("#LOGO#", fileLogo);
	html = html.replace("#SEARCH#", fileSearch);
	html = html.replace("#FOOTER#", fileFooter);
	html = html.replace("#OVERLAY#", fileOverlay);







	// create endpoints for data
	jsonData.forEach(function(item, i){
		if(item.render){
			console.log("item", item);
			var current = html,
				pathMain = '' + item.path.replace(':rid', 'rid').replace(':sid', 'sid') + '.html',
				templateMain = path.join(__dirname+''+htmlPagesPath+'/endpoints' + pathMain + ''),
				fileMain = fs.readFileSync(templateMain).toString();

			fileMain = fileMain.replace("#PAGING#", filePaging).replace("#PAGING#", filePaging);
			current = current.replace("#HEAD#", fileHead).replace("#MAIN#", fileMain);
			paths.push([item, current]);
		}
	});
	paths.map((controllerName) => {
	  controller = require('./routes/database');
	  controller.setup(app, controllerName[0], controllerName[1]);
	});

	// create endpoint for character
	console.log("Registering endpoint: /character");
	app.get('/character', (req, res) => {
		var current = html,
			templateMain = path.join(__dirname+''+htmlPagesPath+'/character.html'),
			fileMain = fs.readFileSync(templateMain).toString();

		var repData = true,
			repAlias = null,
			repPath = null,
			repRobots = "noindex follow",
			repTitle = "D&amp;D: Search",
			repDescription = "Search for D&amp;D feats, classes, spells and more here.",
			repKeywords = "D&amp;D, DnD, dndtools, feats, spells, classes",
			repUrl = "/search",
			repType = "search";

		fileMain = fileMain.replace("#PAGING#", filePaging).replace("#PAGING#", filePaging);
		current = current.replace("#HEAD#", fileHead);
		current = htmlReplacements(current, fileMain, repAlias, repPath, repData, repRobots, repTitle, repDescription, repKeywords, repUrl, repType);
		res.send(current);
	});

	// create endpoint for search
	console.log("Registering endpoint: /search");
	app.get('/search', (req, res) => {
		var current = html,
			templateMain = path.join(__dirname+''+htmlPagesPath+'/default.html'),
			fileMain = fs.readFileSync(templateMain).toString();

		var repData = true,
			repAlias = null,
			repPath = null,
			repRobots = "noindex follow",
			repTitle = "D&amp;D: Search",
			repDescription = "Search for D&amp;D feats, classes, spells and more here.",
			repKeywords = "D&amp;D, DnD, dndtools, feats, spells, classes",
			repUrl = "/search",
			repType = "search";

		fileMain = fileMain.replace("#PAGING#", filePaging).replace("#PAGING#", filePaging);
		current = current.replace("#HEAD#", fileHead);
		current = htmlReplacements(current, fileMain, repAlias, repPath, repData, repRobots, repTitle, repDescription, repKeywords, repUrl, repType);
		res.send(current);
	});

	// create endpoint for home
	console.log("Registering endpoint: /");
	app.get('/', (req, res) => {
		var current = html,
			templateMain = path.join(__dirname+''+htmlPagesPath+'/default.html'),
			fileMain = fs.readFileSync(templateMain).toString();

		var repData = true,
			repAlias = null,
			repPath = null,
			repRobots = "index follow",
			repTitle = "D&amp;D",
			repDescription = "",
			repKeywords = "",
			repUrl = "",
			repType = "";

		fileMain = fileMain.replace("#PAGING#", filePaging).replace("#PAGING#", filePaging);
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
			var current = html,
				templateMain = path.join(__dirname+''+htmlErrorsPath+'/'+err.status+'.html'),
				fileMain = fs.readFileSync(templateMain).toString();

			var repData = false,
				repAlias = null,
				repPath = null,
				repRobots = "noindex follow",
				repTitle = "D&amp;D: Page not found (Error " + err.status + ")",
				repDescription = "Error page",
				repKeywords = "",
				repUrl = "",
				repType = "error";

			fileMain = fileMain.replace("#PAGING#", filePaging).replace("#PAGING#", filePaging);
			current = current.replace("#HEAD#", fileHead);
			current = htmlReplacements(current, fileMain, repAlias, repPath, repData, repRobots, repTitle, repDescription, repKeywords, repUrl, repType);
			res.send(current);
		});
	}
	// error handling - production
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		var current = html,
			templateMain = path.join(__dirname+''+htmlErrorsPath+'/'+err.status+'.html'),
			fileMain = fs.readFileSync(templateMain).toString();

		var repData = false,
			repAlias = null,
			repPath = null,
			repRobots = "noindex follow",
			repTitle = "D&amp;D: Page not found (Error "+ err.status +")",
			repDescription = "",
			repKeywords = "",
			repUrl = "",
			repType = "";

		fileMain = fileMain.replace("#PAGING#", filePaging).replace("#PAGING#", filePaging);
		current = current.replace("#HEAD#", fileHead);
		current = htmlReplacements(current, fileMain, repAlias, repPath, repData, repRobots, repTitle, repDescription, repKeywords, repUrl, repType);
		res.send(current);
	});


	// start gulp for assets
	gulp.start("build");
	// start webserver
	//var httpsServer = https.createServer({ key  : fs.readFileSync('key.pem'), cert : fs.readFileSync('cert.pem') }, app);
	//httpsServer.listen(443);
	var httpServer = http.createServer(app);
	httpServer.listen(82);
}





// service request - with callback when done.
var serviceRequest = function(){
    console.log(serverPath + "/endpoints");
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (this.readyState === 4) { serviceCallback(this.responseText); }
	};
	xhr.open("GET", serverPath + "/endpoints");
	xhr.send();
}



// start service request to get endpoints from webservice
serviceRequest();