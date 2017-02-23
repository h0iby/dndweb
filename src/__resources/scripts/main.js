// = include /vendor/domready.js
// = include /site/services.js
// = include /site/slider.js

var dnd = dnd || {};
DomReady.ready(function() {
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};

	if (typeof(Storage) !== "undefined") {
		dnd.vars.localStorage = true;
	} else {
		dnd.vars.localStorage = false;
	}


	dnd.initService();
	dnd.dataLoaded = function(){
		console.log("after data has been loaded");
	}


	dnd.slider();
});