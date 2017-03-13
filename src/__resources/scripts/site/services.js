var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};

	var loadError = function(){
		console.log("Error loading data");
	}

	var loadData = function(hasLocalStorage){
		dnd.ajax(dnd.vars.webservice + "/endpoints", function(endpoints){
			dnd.service.endpoints = JSON.parse(endpoints);
			dnd.vars.endpointAmount = 1;

			if(hasLocalStorage){
				localStorage.setItem("endpoints", endpoints);
			}
			dnd.service.endpoints.forEach(function(endpoint, id){
				if(endpoint.path.indexOf(":id") == -1){
					dnd.ajax(dnd.vars.webservice + endpoint.path, function(data){
						dnd.vars.endpointAmount = dnd.vars.endpointAmount + 1;
						dnd.service["" + endpoint.alias + ""] = data;
						if(hasLocalStorage){
							localStorage.setItem(endpoint.alias, JSON.stringify(data));
						}
					}, function(){ loadError(); }, function(){ loadError(); });
				}
			});
		}, function(){ loadError(); }, function(){ loadError(); });
	}

	var service = function(){
		if(dnd.vars.localStorage && localStorage.length == 0){
			loadData(true);
		} else if (dnd.vars.localStorage){
			dnd.vars.endpointAmount = 1;
			JSON.parse(localStorage.getItem("endpoints")).forEach(function(endpoint, id){
				if(endpoint.path.indexOf(":id") == -1){
					dnd.vars.endpointAmount = dnd.vars.endpointAmount + 1;
					var localItem = localStorage.getItem(endpoint.alias);
					dnd.service["" + endpoint.alias + ""] = JSON.parse(localItem);
				}
			});
		} else {
			loadData(false);
		}

		//serviceInterval();
	}

	var serviceInterval = function(){
		var counter = 0;
		var interval = setInterval(function(){
			counter = counter + 10;
			var intervalClear = true;
			if (dnd.vars.localStorage){
				console.log("endpointAmount: " + dnd.vars.endpointAmount);
				console.log("localstorage: ", localStorage.length);
				if(dnd.vars.endpointAmount == localStorage.length){
					console.log("TEST");
					clearInterval(interval);
					dnd.vars.serviceLoaded = true;
					if(counter < 1000){
						dnd.vars.serviceLoadedSpeed = counter + "ms";
					} else {
						dnd.vars.serviceLoadedSpeed = parseFloat(counter/1000) + "s";
					}
				}
			} else {
				if(dnd.service.endpoints != undefined){
					dnd.service.endpoints.forEach(function(endpoint, id){
						if(endpoint.path.indexOf(":id") == -1){
							if(dnd.service["" + endpoint.alias + ""] == undefined){
								intervalClear = false;
							}
						}
					});
				} else {
					intervalClear = false;
				}
				if(intervalClear){
					clearInterval(interval);
					dnd.vars.serviceLoaded = true;
					if(counter < 1000){
						dnd.vars.serviceLoadedSpeed = counter + "ms";
					} else {
						dnd.vars.serviceLoadedSpeed = parseFloat(counter/1000) + "s";
					}
				}
			}
		}, 1);
	}

	dnd.initService = function(callback){
		var loader = dnd.selector("#Loader");

		dnd.vars.serviceLoaded = false;
		dnd.vars.serviceLoadedSpeed = "-1";

		if(dnd.database){
			localStorage.clear();
			loader.style.display = 'block';
			service();
			var interval = setInterval(function(){
				if(dnd.vars.serviceLoaded){
					clearInterval(interval);
					console.log("json loaded in", dnd.vars.serviceLoadedSpeed);
					callback();
					if (loader.classList){
						loader.classList.add("loaded");
					} else {
						loader.className += ' ' + "loaded";
					}
				}
			}, 100);
		} else {
			loader.style.display = 'none';
		}

	}
})();