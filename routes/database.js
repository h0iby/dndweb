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
            
            var replaceFunction = function(replaceFrom, replaceTo){
                if(current.indexOf(replaceFrom) > -1){
                    current = current.replace(replaceFrom, replaceTo);
                    replaceFunction(replaceFrom, replaceTo);
                }
            }
            
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

                replaceFunction("#LOADDATA#", repData);
                replaceFunction("#MENUITEM#", repAlias);
                replaceFunction("#MENUENDPOINT#", repPath);
                replaceFunction("#DATAENDPOINT#", repPath);
                replaceFunction("#ROBOTS#", repRobots);
                
                replaceFunction("#PAGETITLE#", repTitle);
                replaceFunction("#METATITLE#", repTitle);
                replaceFunction("#OGTITLE#", repTitle);
                replaceFunction("#TWITTERTITLE#", repTitle);
                replaceFunction("#PROPTITLE#", repTitle);
                
                replaceFunction("#METADESCRIPTION#", repDescription);
                replaceFunction("#PROPDESCRIPTION#", repDescription);
                replaceFunction("#OGDESCRIPTION#", repDescription);
                replaceFunction("#TWITTERDESCRIPTION#", repDescription);
                replaceFunction("#TWITTERCARD#", repDescription);
                
                replaceFunction("#METAKEYWORDS#", repKeywords);
                
                replaceFunction("#OGURL#", repKeywords);
                replaceFunction("#CANNONICAL#", repKeywords);
                
                replaceFunction("#OGTYPE#", repType);

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
