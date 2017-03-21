// = include /site/helpers.js
// = include /site/templates.js
// = include /site/filters.js
// = include /site/services.js

var dnd = dnd || {};
(function() {
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};

	if (typeof(Storage) !== "undefined") {
		dnd.vars.hasLocalStorage = true;
	} else {
		dnd.vars.hasLocalStorage = false;
	}

	var header = dnd.selector("#Header");
	setTimeout(function(){ header.classList.add("is-shown"); }, 1);

	dnd.dataLoaded = function(){
		dnd.filters();
		dnd.templates();
	}
	dnd.initService(dnd.dataLoaded);
})();