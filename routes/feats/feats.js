var name = "feats";
var endpoint = "/database/" + name;



module.exports = {
    setup: (app, marko, fs, path, root) => {
        console.log("Registering endpoint: " + endpoint);

		app.get(endpoint, (req, res) => {

			var pageHtml = "";
			//fs.readFile(path.join(__dirname+'/../../'+root+'/database/index.html'), 'utf8', function (err,data) {
			fs.readFile(path.join(__dirname+'/'+name+'.html'), 'utf8', function (err,data) {
				if (err) {
					return console.log(err);
				}
				pageHtml = data;
				var mainTemplate = marko.load(require('./../../src/database/index.marko'));
				mainTemplate.render({ data: pageHtml }, res);
			});



        });
    }
}