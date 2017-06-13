var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};
	var db;
	var dataUrl = "http://";
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


	dnd.dataadd = function(){
		console.log(db);
		var request = db.transaction(["dndData"], "readwrite")
                .objectStore("dndData")
                .add({ id: "00-03", name: "Kenny", age: 19, email: "kenny@planet.org" });

        request.onsuccess = function(event) {
                alert("Kenny has been added to your database.");
        };

        request.onerror = function(event) {
                alert("Unable to add data\r\nKenny is aready exist in your database! ");
        }

	}

	dnd.dataread = function() {
		console.log(db);
        var transaction = db.transaction(["dndData"]);
        var objectStore = transaction.objectStore("dndData");
        var request = objectStore.get("00-03");
        request.onerror = function(event) {
          alert("Unable to retrieve daa from database!");
        };
        request.onsuccess = function(event) {
          // Do something with the request.result!
          if(request.result) {
                alert("Name: " + request.result.name + ", Age: " + request.result.age + ", Email: " + request.result.email);
          } else {
                alert("Kenny couldn't be found in your database!");
          }
        };
	}

	dnd.datareadall = function(){
		var objectStore = db.transaction("dndData").objectStore("dndData");

        objectStore.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;
          if (cursor) {
                alert("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
                cursor.continue();
          }
          else {
                alert("No more entries!");
          }
        };

	}


	dnd.data = function(){
		var loader = dnd.selector("#Loader");
		dataUrl += dnd.path;

		if(dnd.endpoint == "" || dnd.menu == ""){
			loader.style.display = 'none';
			loader.classList.add("is-hidden");
		} else {
			if(dnd.vars.indexeddb){
				console.log("test");

				const dndData = [
				  { id: "00-01", name: "Bill", age: 35, email: "bill@company.com" },
				  { id: "00-02", name: "Donna", age: 32, email: "donna@home.org" }
				];

				var request = window.indexedDB.open("dndDB", 1);

				request.onerror = function(event) { loadError(); };

				request.onsuccess = function(event) {
				  db = request.result;
					console.log(db);
				};



				request.onupgradeneeded = function(event) {
					var db = event.target.result;
					var objectStore = db.createObjectStore("dndData", {keyPath: "id"});
					for (var i in dndData) { objectStore.add(dndData[i]); }
				}


			} else {
			}
		}
	}
})();