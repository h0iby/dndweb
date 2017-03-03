var path = require('path'),
	paths = [],
	XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
    setup: (app, endpoint, endpoints) => {
		var current = endpoint.path;
		var alias = endpoint.alias;
		var related = endpoint.related;
		var route = "/database/" + current;

		console.log("Registering endpoint: " + route);

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

		app.get(route, (req, res) => {
			res.sendFile(path.join(__dirname+'/../src/index.html'));
        });
    }
}



//