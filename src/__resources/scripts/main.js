// = include /site/helpers.js
// = include /site/filters.js
// = include /site/services.js
// = include /site/navigation.js
// = include /site/templates.js

var dnd = dnd || {};
(function() {
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};
	dnd.path = "localhost:81";

    dnd.vars.localstorage = false;
    dnd.vars.indexeddb = false;

	if (typeof(Storage) !== "undefined") { dnd.vars.localstorage = true; }
    if (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB) { dnd.vars.indexeddb = true; }

    dnd.navigation();
    dnd.filters();
    dnd.templates();
})();