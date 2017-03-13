// = include /site/helpers.js
// = include /site/templates.js
// = include /site/filters.js
// = include /site/services.js

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
		dnd.filters();
		dnd.templates();
	}
	dnd.initService(dnd.dataLoaded);
})();