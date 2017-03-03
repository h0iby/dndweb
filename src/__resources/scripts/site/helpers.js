var dnd = dnd || {};
(function() {
	"use strict";

	dnd.ajax = function(dataUrl, successFunction, errorFunction){
		var request = new XMLHttpRequest();
		request.open('GET', dataUrl, true);
		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				successFunction(request.responseText);
			} else {
				errorFunction();
			}
		};

		request.onerror = function() {
			errorFunction();
		};

		request.send();
	}
	
	dnd.selector = function(selector, parent){
		selector = selector.trim();

		if (!parent) {
			parent = document;
		}

		if (selector.indexOf(' ') === -1) {
			if (selector.lastIndexOf('.') === 0) {
				return parent.getElementsByClassName(selector.substring(1));
			}

			if (selector.lastIndexOf('#') === 0) {
				return parent.getElementById(selector.substring(1));
			}
		}

		return parent.querySelectorAll(selector);
	}
})();