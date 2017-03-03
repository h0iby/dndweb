// = include /vendor/template7.js
// = include /site/helpers.js
// = include /site/services.js
// = include /site/slider.js

var dnd = dnd || {};
(function() {
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};

	if (typeof(Storage) !== "undefined") {
		dnd.vars.localStorage = true;
	} else {
		dnd.vars.localStorage = false;
	}
	
	dnd.dataLoaded = function(){
		console.log("after data has been loaded");
	}

	dnd.slider();
	dnd.initService(dnd.dataLoaded);
})();