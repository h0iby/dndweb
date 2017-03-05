var path = require('path'),
	paths = [],
	XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
	fs = require('fs');

module.exports = {
    setup: (app, endpoint, endpoints) => {
		var current = endpoint.path,
			alias = endpoint.alias,
			related = endpoint.related,
			route = "/database/" + current,
			templateMain = path.join(__dirname+'/../src/_default/index.html'),
			templateMenu = path.join(__dirname+'/../src/_default/menu.html'),
			templateContent = path.join(__dirname+'/../src/_templates/' + current.replace("/", "-") + '.html');


		var serviceCallback = function(data){
			var jsonData = JSON.parse(data);
			var paths = [];

			jsonData.forEach(function(item, i){
				paths.push(["subroutes", related, item]);
			});

			paths.map((controllerName) => {
			  controller = require('./' + controllerName[0]);
			  controller.setup(app, controllerName[1], controllerName[2]);
			});
		}

		var serviceRequest = function(url){
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (this.readyState === 4) { serviceCallback(this.responseText); }
			};
			xhr.open("GET", url);
			xhr.send();
		}
		serviceRequest("http://localhost:81/" + current);


		var fileMain = fs.readFileSync(templateMain).toString(),
			fileMenu = fs.readFileSync(templateMenu).toString(),
			fileContent = fs.readFileSync(templateContent).toString();

		var html = fileMain.replace("#DBMENU#", fileMenu).replace("#MAIN#", fileContent);

		//console.log("Registering endpoint: " + route);
		app.get(route, (req, res) => {
			res.send(html);
		});
    }
}
