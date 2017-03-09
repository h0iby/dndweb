var path = require('path'),
	paths = [],
	XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
	fs = require('fs');

module.exports = {
    setup: (app, item, html) => {
		app.get("/database" + item.path, (req, res) => {
			res.send(html);
		});

    }
}
