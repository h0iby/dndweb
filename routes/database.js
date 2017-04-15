var path = require('path')
	,paths = []
	,XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
	,fs = require('fs')
	;

module.exports = {
    setup: (app, item, html) => {
		console.log("Registering endpoint: " + item.path);
		app.get(item.path, (req, res) => {
			var current = html;
			var serviceCallback = function(response){
				var output = JSON.parse(response)
					,repData = true
					,repAlias = item.alias.replace("-rid", "--" + req.params.rid).replace("-sid", "--" + req.params.sid)
					,repPath = item.path.replace(":rid", req.params.rid).replace(":sid", req.params.sid)
					,repRobots = "index follow"
					,repTitle = 'D&amp;D: ' + item.menu
					,repDescription = 'D&amp;D ' + item.menu
					,repKeywords = ''
					,repUrl = ''
					,repType = 'article'
					;

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

				current = current.replace("#LOADDATA#", repData);
				current = current.replace("#MENUITEM#", repAlias);
				current = current.replace("#MENUENDPOINT#", repPath);
				current = current.replace("#DATAENDPOINT#", repPath);
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
                console.log("http://localhost");
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function(err) {
					if (this.readyState === 4) { serviceCallback(this.responseText); }
				};
				xhr.open("GET", "http://localhost" + item.path.replace(":id", req.params.id).replace(":rid", req.params.rid).replace(":sid", req.params.sid));
				xhr.send();
			}
			serviceRequest();
		});

    }
}
