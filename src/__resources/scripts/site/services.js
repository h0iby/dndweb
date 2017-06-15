var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};
	var db;
	var dataUrl = "http://";
	var loadError = function(text){ var output = text == null ? "Error loading data" : text; console.log("Data Error", output); }

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
	/*

    var loadData = function(callback){
        callback;
    }

    var saveData = function(json, callback){
        dnd.service[dnd.menu] = json;
        callback;
    }


    dnd.data = function(endpoint, callback, item, template, type){
		var loader = dnd.selector("#Loader");
		dataUrl += dnd.path;
		console.log("TEST");
		if(dnd.endpoint == "" || dnd.menu == ""){
			loader.style.display = 'none';
			loader.classList.add("is-hidden");
		} else {
			var dataLoad = false;
			//do IndexedDB (localstorage is too small)

			if(!dataLoad){
				console.log(dataUrl);
				dnd.ajax(dataUrl + endpoint, function(data){
					var json = JSON.parse(data);

					var loader = dnd.selector("#Loader");
					loader.style.display = 'none';
					loader.classList.add("is-hidden");

					if(json != null){
						saveData(json, callback(item, template, type, json));
					}

				}, function(){ loadError(); }, function(){ loadError(); });
			} else {
				var json = dnd.service[dnd.menu];
				loadData(callback(item, template, type, json));
			}
		}
	}

	*/


	var indexedDbAdd = function(item){
		var request = db.transaction(["dndData"], "readwrite").objectStore("dndData").add({ id: "00-03", name: "Kenny", age: 19, email: "kenny@planet.org" });
		request.onsuccess = function(event) {
			console.log("added");
		};
		request.onerror = function(event) { loadError("IndexedDb Add"); };
	}

	var indexedDbReadSingle = function(itemId) {
		var item = [];
		var transaction = db.transaction(["dndData"]);
		var objectStore = transaction.objectStore("dndData");
		var request = objectStore.get(itemId);
		request.onerror = function(event) { loadError("IndexedDb Read Single"); };
		request.onsuccess = function(event) {
			if(request.result) {
				console.log("result", request.result);
			}


		};
	}

	var indexedDbReadAll = function(dbTable){
		var objectStore = db.transaction(dbTable).objectStore(dbTable);

		objectStore.openCursor().onerror = function(){ loadError("IndexedDb Read All"); }

		objectStore.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				console.log(cursor.key);
				cursor.continue();
			} else {}

		};
			console.log("done");
	}


	var indexedDb = function(dbTable, dbMode, dbInput){
		var request = window.indexedDB.open("dndDB", 1);
		request.onerror = function(event) { loadError(); };
		request.onsuccess = function(event) {
			db = request.result;

			/*
			var tableIsAvailable = false;
			for(var i = 0; i < db.objectStoreNames.length; i++){
				if(dbTable == db.objectStoreNames[i]){
					tableIsAvailable = true;

				}
			}

			if(!tableIsAvailable){
				const dndData = [];
				var objectStore = db.createObjectStore(dbTable, {keyPath: "id"});
				for (var i in dndData) { objectStore.add(dndData[i]); }
			}
*/
			//indexedDbAdd(dbTable, dbInput);
			//indexedDbReadAll(dbTable);
			//indexedDbReadSingle(dbTable, "00-03");
		};
		request.onupgradeneeded = function(event) {
			const dndData = [];
			var db = event.target.result;
			var objectStore = db.createObjectStore(dbTable, {keyPath: "id"});
			for (var i in dndData) { objectStore.add(dndData[i]); }
		}
	}




	var indexedDbInit = function(){
		var request = window.indexedDB.open("dndDB", 1);
		request.onerror = function(event) { loadError(); };
		request.onsuccess = function(event) {
			db = request.result;
		}
		request.onupgradeneeded = function(event) {
			var db = event.target.result;
			var objectStore = db.createObjectStore("dndData", {keyPath: "id"});
		}
	}



	dnd.data = function(){
		var loader = dnd.selector("#Loader");
		dataUrl += dnd.path;

		if(dnd.endpoint == "" || dnd.menu == ""){
			loader.style.display = 'none';
			loader.classList.add("is-hidden");
		} else {
			if(dnd.vars.indexeddb){
				indexedDbInit();
				//indexedDb(dnd.type);



			} else {
			}
		}
	}
})();