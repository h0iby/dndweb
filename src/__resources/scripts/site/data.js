var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};
	var idb;
	var idbName = "dndDB";
	var http = "http://";
	var url = "";
	var loadError = function(text){ var output = text == null ? "Error loading data" : text; console.log("Data Error", output); }
	var cookieGet = function(){
		var cookie = null;

		if(document.cookie != "" && document.cookie != null){
			cookie = document.cookie;
		}

		return cookie;
	}
	var cookieSet = function(){
		var d = new Date();
		d.setTime(d.getTime() + (365*24*60*60*1000));
		var expires = "expires="+ d.toUTCString();
		document.cookie = "dndDB=true;" + expires + ";path=/";
	}
	var dataToDnd = function(item, obj, callback){
		dnd.service["" + obj.id + ""] = obj.data;
		if(callback != null){
			callback(item, obj.data);
		}
	}
	var idbDataAdd = function(item, callback){
		dnd.ajax(true, url + "" + item.getAttribute("data-endpoint"), function(data){
			var json = JSON.parse(data);
			idb.transaction([item.getAttribute("data-type")], "readwrite").objectStore(item.getAttribute("data-type")).add({ id: item.getAttribute("data-item"), data: json });
			idbDataCheck(item, callback);
		}, function(){ loadError(); }, function(){ loadError(); });
	}
	var idbDataCheck = function(item, callback){
		var idbTansaction = idb.transaction([item.getAttribute("data-type")], "readwrite");
		var idbObjStore = idbTansaction.objectStore(item.getAttribute("data-type"));
		var idbObjStoreReq = idbObjStore.get(item.getAttribute("data-item"));
		idbObjStoreReq.onsuccess = function(event) {
			var obj = idbObjStoreReq.result;
			if(obj == null){
				idbDataAdd(item, callback);
			} else {
				dataToDnd(item, obj, callback);
			}
		}
	}
	var idbStart = function(item, data, callback){
		var request = window.indexedDB.open(idbName, 1);
		request.onerror = function(event) { loadError("idbStart Error"); };
		request.onsuccess = function(event) {
			idb = request.result;
			idbDataCheck(item, callback);
		}
		request.onupgradeneeded = function(event) {
			idb = event.target.result;
			data.forEach(function(obj, i){
				var objectStore = idb.createObjectStore(obj.alias, {keyPath: "id"});//
			});
		}
	}
	var idbInit = function(item, callback){
		if(cookieGet() == null){
			cookieSet();
			dnd.ajax(true, url + "/endpoints", function(data){
				var json = JSON.parse(data);
				idbStart(item, json, callback);
			}, function(){ loadError(); }, function(){ loadError(); });
		} else {
			idbStart(item, null, callback);
		}
	}
	var apiInit = function(item, callback){
		var obj = [{ id: 0, data: {} }];
		dnd.ajax(true, url + "" + item.getAttribute("data-endpoint"), function(data){
			var json = JSON.parse(data);
			obj.id = item.getAttribute("data-type");
			obj.data = json;
			dataToDnd(item, obj, callback);
		}, function(){ loadError(); }, function(){ loadError(); });
	}
	dnd.data = function(item, callback){
		url = http + dnd.path;
		if(dnd.vars.indexeddb){
			idbInit(item, callback);
		} else {
			apiInit(item, callback);
		}
	}
})();