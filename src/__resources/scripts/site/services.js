var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};
	var dataUrl = "http://localhost";
    console.log(dataUrl);
	var loadError = function(){ console.log("Error loading data"); }
    
    
    /*
	var loadData = function(hasLocalStorage, callback){
		dnd.ajax(dataUrl + "/endpoints", function(endpoints){
			var total = 0, counter = 0;
			dnd.service.endpoints = JSON.parse(endpoints);

			if(hasLocalStorage){
				localStorage.setItem("endpoints", endpoints);
			}

			dnd.service.endpoints.forEach(function(endpoint, id){
				if(endpoint.path.indexOf(":rid") == -1 && endpoint.path.indexOf(":sid") == -1){ total++; }
			});


			dnd.service.endpoints.forEach(function(endpoint, id){
				if(endpoint.path.indexOf(":rid") == -1 && endpoint.path.indexOf(":sid") == -1){

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


		if(dnd.vars.hasLocalStorage && localStorage.length == 0){
			loadData(true, callback);
		} else if (dnd.vars.hasLocalStorage){
			var counter = 0;
			JSON.parse(localStorage.getItem("endpoints")).forEach(function(endpoint, id){
				counter++;
				if(endpoint.path.indexOf(":rid") == -1 && endpoint.path.indexOf(":sid") == -1){
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

	

	dnd.initService = function(callback){
		var loader = dnd.selector("#Loader");
		//localStorage.clear();
		if(dnd.database){
			service(callback);
		} else {
			loader.style.display = 'none';
		}
	}
    */

    dnd.data = function(endpoint, callback, item, template, type){
        //do IndexedDB (localstorage is too small)
        
        dnd.ajax(dataUrl + endpoint, function(data){
            var json = JSON.parse(data);
            
            var loader = dnd.selector("#Loader");
            loader.style.display = 'none';
            loader.classList.add("is-hidden");
            
            if(json != null){
                callback(item, template, type, json);
            }
            
        }, function(){ loadError(); }, function(){ loadError(); });
	}
})();