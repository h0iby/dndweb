var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};
	var dataUrl = "http://dnd.exchange";
	var loadError = function(){ console.log("Error loading data"); }
	var loadData = function(hasLocalStorage, callback){
		dnd.ajax(dataUrl + "/endpoints", function(endpoints){
			var total = 0, counter = 0;
			dnd.service.endpoints = JSON.parse(endpoints);

			if(hasLocalStorage){
				localStorage.setItem("endpoints", endpoints);
			}

			dnd.service.endpoints.forEach(function(endpoint, id){
				if(endpoint.path.indexOf(":id") == -1 && endpoint.path.indexOf(":rid") == -1 && endpoint.path.indexOf(":sid") == -1){ total++; }
			});

			dnd.service.endpoints.forEach(function(endpoint, id){
				if(endpoint.path.indexOf(":id") == -1 && endpoint.path.indexOf(":rid") == -1 && endpoint.path.indexOf(":sid") == -1){
					dnd.ajax(dataUrl + endpoint.path, function(data){
						counter++;
						dnd.service["" + endpoint.alias + ""] = JSON.parse(data);
						if(hasLocalStorage){
							localStorage.setItem(endpoint.alias, JSON.stringify(data));
						}
						if(counter == total){ serviceLoaded(callback); }
					}, function(){ loadError(); }, function(){ loadError(); });
				}
			});
		}, function(){ loadError(); }, function(){ loadError(); });
	}
	var service = function(callback){
		if(dnd.vars.localStorage && localStorage.length == 0){
			loadData(true, callback);
		} else if (dnd.vars.localStorage){
			var counter = 0;
			JSON.parse(localStorage.getItem("endpoints")).forEach(function(endpoint, id){
				counter++;
				if(endpoint.path.indexOf(":id") == -1 && endpoint.path.indexOf(":rid") == -1 && endpoint.path.indexOf(":sid") == -1){
					var localItem = localStorage.getItem(endpoint.alias);
					dnd.service["" + endpoint.alias + ""] = JSON.parse(JSON.parse(localItem));
				}
				if(counter == JSON.parse(localStorage.getItem("endpoints")).length){
					serviceLoaded(callback);
				}
			});
		} else {
			loadData(false, callback);
		}
	}

	var serviceLoaded = function(callback){
		var loader = dnd.selector("#Loader");
		if (loader.classList){ loader.classList.add("loaded"); }
		else { loader.className += ' ' + "loaded"; }
		callback();
	}

	dnd.initService = function(callback){
		var loader = dnd.selector("#Loader");
		if(dnd.database){
			loader.style.display = 'block';
			service(callback);
		} else {
			loader.style.display = 'none';
		}
	}
})();