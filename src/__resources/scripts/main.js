// = include /site/helpers.js
// = include /site/navigation.js
// = include /site/data.js
// = include /site/templates.js
// = include /site/filters.js
// = include /site/filter.js
// = include /site/slider.js

var dnd = dnd || {};
(function() {
	dnd.vars = dnd.vars || {};
	dnd.path = "localhost:81";
    dnd.vars.localstorage = false;
    dnd.vars.indexeddb = false;
	dnd.vars.modern = false;
	dnd.vars.listrun = false;
	dnd.vars.scollPos = localStorage.getItem("scrollPos");
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
	if (typeof(Storage) !== "undefined") { dnd.vars.localstorage = true; }
    if (window.indexedDB) { dnd.vars.indexeddb = true; }
	if(dnd.vars.indexeddb && dnd.vars.localstorage){ dnd.vars.modern = true; }
	var dataIsLoaded = function(){
		dnd.loader(false);
		dnd.templates(null);

		var dataSlow = document.querySelectorAll('[data-slow]');
		for(var i = 0; i < dataSlow.length; i++){
			var item = dataSlow[i];
			item.setAttribute("style", "background-image: url('" + item.getAttribute("data-slow") + "');");
		}
	}
	dnd.navigation();
	dnd.sliders();
	dnd.data(dataIsLoaded, null);
})();