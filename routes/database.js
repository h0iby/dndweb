var path = require('path'),
	paths = [],
	XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
	fs = require('fs');

module.exports = {
    setup: (app, item, html) => {
		var htmlPath = "/../__resources/html";
		var htmlTemplatesPath = htmlPath + "/templates";
		var templateHead = path.join(__dirname+''+htmlTemplatesPath+'/head.html');
		var fileHead = fs.readFileSync(templateHead).toString();

		app.get("/database" + item.path, (req, res) => {

			var serviceCallback = function(response){
				var output = JSON.parse(response);
				var current = html.replace('#HEAD#', fileHead);

				var repAlias = item.alias,
					repPath = item.path,
					repRobots = "index follow",
					repTitle = 'D&amp;D: ' + item.menu,
					repDescription = 'D&amp;D ' + item.menu,
					repKeywords = '',
					repUrl = '',
					repType = 'article';

				if(output.length < 1){
					repRobots = 'noindex follow';
					repTitle = "D&amp;D: Page not found (Error 404)";
				} else if(output.length == 1) {
					output = output[0];

					repType = 'article';

					if(output.name != null && output.name != undefined){
						repTitle += ": " + output.name;
					}
				}

				current = current.replace("#MENUITEM#", repAlias);
				current = current.replace("#MENUENDPOINT#", repPath);
				current = current.replace("#ROBOTS#", repRobots);

				current = current.replace("#PAGETITLE#", repTitle);
				current = current.replace("#METATITLE#", repTitle);
				current = current.replace("#OGTITLE#", repTitle);
				current = current.replace("#TWITTERTITLE#", repTitle);
				current = current.replace("#PROPTITLE#", repTitle);

				current = current.replace("#METADESCRIPTION#", repDescription);
				current = current.replace("#PROPDESCRIPTION#", repDescription);
				current = current.replace("#OGDESCRIPTION#", repDescription);
				current = current.replace("#TWITTERDESCRIPTION#", repDescription);
				current = current.replace("#TWITTERCARD#", repDescription);

				current = current.replace("#METAKEYWORDS#", repKeywords);

				current = current.replace("#OGURL#", repUrl);
				current = current.replace("#CANNONICAL#", repUrl);

				current = current.replace("#OGTYPE#", repType);

				res.send(current);
			}

			var serviceRequest = function(){
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function(err) {
					if (this.readyState === 4) { serviceCallback(this.responseText); }
				};
				xhr.open("GET", "http://localhost:80" + item.path.replace(":id", req.params.id));
				xhr.send();
			}
			serviceRequest();
		});

    }
}
