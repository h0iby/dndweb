var path = require('path'),
	paths = [],
	XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
	fs = require('fs');

module.exports = {
    setup: (app, item, html) => {
		app.get("/database" + item.path, (req, res) => {

			var serviceCallback = function(response){
				if(response == "[]"){
					robots = 'noindex follow';
				} else {
					robots = 'index follow';
				}
				html = html.replace('#ROBOTS#', robots);
				res.send(html);
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
