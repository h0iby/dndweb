module.exports = {
    setup: (app, name) => {
        //var name = "feats";
        var endpoint = "/database/" + name;
        console.log("Registering endpoint: " + endpoint);

		app.get(endpoint, (req, res) => {
        });
    }
}