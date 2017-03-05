var path = require('path'),
	XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
	fs = require('fs');

module.exports = {
    setup: (app, base, endpoint) => {
		var current = base + "/" + endpoint.slug,
			name = endpoint.name,
			route = "/database/" + current,
			templateMain = path.join(__dirname+'/../src/_default/index.html'),
			templateMenu = path.join(__dirname+'/../src/_default/menu.html'),
			templateContent = path.join(__dirname+'/../src/_templates/' + base.replace("/", "-") + '.html');

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



//