// = include /site/helpers.js
// = include /site/navigation.js
// = include /site/data.js
// = include /site/templates.js
// = include /site/filters.js
// = include /site/filter.js

var dnd = dnd || {};
(function() {
	dnd.vars = dnd.vars || {};
	dnd.path = "localhost:81";
    dnd.vars.localstorage = false;
    dnd.vars.indexeddb = false;
	dnd.vars.modern = false;
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
	if (typeof(Storage) !== "undefined") { dnd.vars.localstorage = true; }
    if (window.indexedDB) { dnd.vars.indexeddb = true; }
	if(dnd.vars.indexeddb && dnd.vars.localstorage){ dnd.vars.modern = true; }

	var dataIsLoaded = function(){
		dnd.loader(false);
		dnd.templates(null);
	}
    dnd.navigation();
	dnd.data(dataIsLoaded, null);
})();