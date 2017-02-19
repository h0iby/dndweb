// = include vendor/jquery-3.1.1.js
// = include site/services.js
// = include site/slider.js

var dnd = dnd || {};


$(function(){
	'use strict';

	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};

	if (typeof(Storage) !== "undefined") {
		dnd.vars.localStorage = true;
	} else {
		dnd.vars.localStorage = false;
	}


	dnd.initService();
	dnd.dataLoaded = function(){
		console.log("data loaded here");
	}
});

