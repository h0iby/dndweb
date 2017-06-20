// = include /site/helpers.js
// = include /site/navigation.js
// = include /site/filters.js
// = include /site/filter.js
// = include /site/data.js
// = include /site/templates.js

var dnd = dnd || {};
(function() {
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};
	dnd.path = "localhost:81";
    dnd.vars.localstorage = false;
    dnd.vars.indexeddb = false;
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
	if (typeof(Storage) !== "undefined") { dnd.vars.localstorage = true; }
    if (window.indexedDB) { dnd.vars.indexeddb = true; }
    dnd.navigation();
	dnd.templates();
})();