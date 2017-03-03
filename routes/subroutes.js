var path = require('path'),
	XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
    setup: (app, base, endpoint) => {
		var current = base + "/" + endpoint.slug;
		var name = endpoint.name;
		var route = "/database/" + current;

        console.log("Registering endpoint: " + route);

		app.get(route, (req, res) => {
			res.sendFile(path.join(__dirname+'/../src/index.html'));
        });
    }
}



//