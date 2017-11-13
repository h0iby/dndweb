var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	var idb, idbName = "dndDB", http = "http://", url = "";
	var loadError = function(text){ var output = text == null ? "Error loading data" : text; console.log("Data Error", output); }
	var idbCheck = function(callback, item){
		var idbTansaction = idb.transaction([item.getAttribute("data-type")], "readwrite");
		var idbObjStore = idbTansaction.objectStore(item.getAttribute("data-type"));
		var idbObjStoreReq = idbObjStore.get(item.getAttribute("data-item"));
		idbObjStoreReq.onsuccess = function(event) {
			var obj = idbObjStoreReq.result;
			if(obj == null){
				dnd.ajax(true, url + "" + item.getAttribute("data-endpoint"), function(data){
					var json = JSON.parse(data);
					idb.transaction([item.getAttribute("data-type")], "readwrite").objectStore(item.getAttribute("data-type")).add({ id: item.getAttribute("data-item"), data: json });
					idbCheck(callback, item);
				}, function(){ loadError(); }, function(){ loadError(); });
			} else {
				callback(item, obj.data);
			}
		}
	}
	var idbData = function(callback, items){
		var count = 0, counter = 0;
		items.filter(function(i) {
			if(i.show != ""){
				count++;
			}
		});
		items.forEach(function(item, i){
			if(item.show != ""){
				dnd.ajax(true, url + "" + item.path, function(data){
					counter++;
					var json = JSON.parse(data);
					idb.transaction([item.alias], "readwrite").objectStore(item.alias).add({ id: item.alias, data: json });
					if(counter == count){
						localStorage.setItem('idbSet', true);
						callback();
					}
				}, function(){ loadError(); }, function(){ loadError(); });
			}
		});
	}
	var idbStart = function(callback, json){
		var request = window.indexedDB.open(idbName, 1);
		request.onerror = function(event) { loadError("idbStart Error"); };
		request.onsuccess = function(event) {
			idb = request.result;
			if(localStorage.getItem('idbSet') == null){
				idbData(callback, json);
			} else {
				callback();
			}
		}
		request.onupgradeneeded = function(event) {
			idb = event.target.result;
			if(localStorage.getItem('idbSet') == null){
				json.forEach(function(obj, i){
					var objectStore = idb.createObjectStore(obj.alias, {keyPath: "id"});
				});
			}
		}
	}
	var idbInit = function(callback){
		if(localStorage.getItem('idbData') == null){
			dnd.ajax(true, url + "/endpoints", function(data){
				localStorage.setItem('idbData', data)
				var json = JSON.parse(data);
				idbStart(callback, json);
			}, function(){ loadError(); }, function(){ loadError(); });
		} else {
			var json = JSON.parse(localStorage.getItem('idbData'));
			idbStart(callback, json);
		}
	}
	var stdInit = function(callback, template){
		if(dnd.vars.modern){
			idbCheck(callback, template);
		} else {
			dnd.ajax(true, url + "" + template.getAttribute("data-endpoint"), function(data){
				var json = JSON.parse(data);
				callback(template, json)
			}, function(){ loadError(); }, function(){ loadError(); });
		}
	}
	dnd.data = function(callback, template){
		url = http + dnd.path;
		if(template != null){
			stdInit(callback, template);
		} else {
			if(dnd.vars.modern){
				idbInit(callback);
			} else{
				callback();
			}
		}
	}
})();