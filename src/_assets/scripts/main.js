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
	dnd.replaceAll = function(string, source, target){
		return string.replace(new RegExp(source, 'g'), target);
	}
	dnd.appendTo = function(target, html){
		target.insertAdjacentHTML('beforeend', html);
	}
	dnd.addEventHandler = function (elem, eventType, handler) {
		if (elem.addEventListener)
			elem.addEventListener (eventType, handler, false);
		else if (elem.attachEvent)
			elem.attachEvent ('on' + eventType, handler);
	}
	dnd.setHash = function(item, value){
		var newItemValue = value != "" ? item + "=" + value.toLowerCase() : "";
		var hash = window.location.hash.substring(1);
		var hashNew = "#" + hash;

		if(history.pushState) {
			if(value != ""){
				if(hash.indexOf(item) < 0){
					if(hashNew.length > 1){
						hashNew += "&";
					}

					hashNew += newItemValue;
				} else {
					if(hash.indexOf("&") < 0){
						hashNew = "#" + newItemValue;
					} else {
						var subStringTemp = hash.substring(hash.indexOf(item));
						var subString = subStringTemp;
						if(subStringTemp.indexOf("&") > -1){
							subString = subStringTemp.substring(0, subStringTemp.indexOf("&"))
						}

						hashNew = hashNew.replace(subString, newItemValue);
					}
				}

				history.pushState(null, null, hashNew);
			} else {
				if(hash.indexOf("&") < 0){
					history.pushState(null, null, " ");
				} else {
					var subStringTemp = hash.substring(hash.indexOf(item));
					var subString = subStringTemp;
					if(subStringTemp.indexOf("&") > -1){
						subString = subStringTemp.substring(0, subStringTemp.indexOf("&"))
					}

					hashNew = hashNew.replace("#" + subString + "&", "#");
					hashNew = hashNew.replace("&" + subString, "");

					history.pushState(null, null, hashNew);
				}
			}
		}
	}
})();
var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};

	var setSelect = function(item, value){
		var select = item;
		var options = select.options;
		for(var o = 0; o < options.length; o++) {
			var option = options[o];
			if(option.value == value.toString()) {
				select.selectedIndex = o;
			}
		}
	}
	var setInputs = function(item, value){
		var input = item;
		input.value = value;
	}

	var setHash = function(item, value){
		dnd.setHash(item, value);
	}
	var getHash = function(){
		var hashItems = window.location.hash.substring(1).split("&");
		for(var i = 0; i < hashItems.length; i++){
			var items = hashItems[i].split("=");
			var item = document.getElementById("filter" + items[0]);
			if(item){
				switch(item.tagName.toLowerCase()){
					case "select":
						setSelect(item, items[1]);
						break;
					default:
						setInputs(item, items[1]);
						break;
				}
			}
		}
	}


	var populateSelect = function(elem){
		var item = document.getElementById("filter" + elem);
		var items = 0;
		if(item){
			var ident = elem.toLowerCase();
			var json = dnd.service[ident];
			if(json != undefined){
				var first = document.createElement("option");
				first.value = "";
				first.innerHTML = "";
				item.appendChild(first);

				items = json.length;
				for(var i = 0; i < json.length; i++){
					var option = document.createElement("option");
					option.value= json[i].slug;
					option.innerHTML = json[i].name;
					item.appendChild(option);
				}
			}

			if(items > 0){
				item.addEventListener('change',function(){
					var select = this;
					var selectValue = select.options[select.selectedIndex].value;
					setHash(elem, selectValue);
					dnd.templates();
				});
			}
		}
	}
	var filterInput = function(elem){
		var item = document.getElementById("filter" + elem);
		if(item){
			var timeout;
			item.addEventListener('keyup',function(){
				if(timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				timeout = setTimeout(function(){
					setHash(elem, item.value);
					dnd.templates();
				}, 500)
			});
		}
	}
	var filterPageAmount = function(){
		dnd.filters.amount = 25;
		if(dnd.vars.localstorage){
			if(localStorage.getItem("filter-amount") == null){
				localStorage.setItem("filter-amount", dnd.filters.amount);
			} else {
				dnd.filters.amount = parseInt(localStorage.getItem("filter-amount"));
			}
		}

		var selects = dnd.selector(".-js-sorting-amount");
		for(var i = 0; i < selects.length; i++){
			var select = selects[i];
			var options = select.options;
			for(var o = 0; o < options.length; o++) {
				var option = options[o];
				if(option.value == dnd.filters.amount.toString()) {
					select.selectedIndex = o;
				}
			}

			select.addEventListener('change',function(){
				var selectValue = this.options[this.selectedIndex].value;
				dnd.filters.amount = parseInt(selectValue);

				if(dnd.vars.localstorage){
					localStorage.setItem("filter-amount", dnd.filters.amount);
				}

				dnd.templates();
			});
		}
	}

	dnd.filters = function(){
		populateSelect("Rulebook");
		populateSelect("Edition");
		populateSelect("Feat-Category");

		filterInput("Slug");
		filterInput("Keywords");
		filterInput("Benefit");

		filterPageAmount();

		getHash();
	}
})();
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


	dnd.data = function(){
		var loader = dnd.selector("#Loader");
		dataUrl += dnd.path;

		if(dnd.endpoint == "" || dnd.menu == ""){
			loader.style.display = 'none';
			loader.classList.add("is-hidden");
		} else {
			if(dnd.vars.indexeddb){
				indexedDb(dnd.type);



			} else {
			}
		}
	}
})();
var dnd = dnd || {};
(function() {
	"use strict";

    dnd.navigation = function(){
        var scrollPos = 0;
        var timeout;
        var header = document.getElementById("Header");
        var headerHeight = header.offsetHeight + 5;
        
        window.onscroll = function() {
            if(window.pageYOffset < scrollPos){
                header.classList.remove("is-hidden");
            } else {
                header.classList.add("is-hidden");
            }
            
            scrollPos = window.pageYOffset;
        };
    }
    
})();
var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};

	//var dataUrl = "http://";
	/*
	var filterData = function(json){
		var hashItems = window.location.hash.substring(1).split("&");
		var filteredJson = json;

		for(var i = 0; i < hashItems.length; i++){
			var items = hashItems[i].split("=");
			var item = items[0].toLowerCase();
			var value = items[1]
			var isDefault = false;

			filteredJson = json.filter(function(row){
				var selectors = [];
				var isInRow = true;

				if(item && row[item]){
					selectors.push(row[item].toLowerCase());
					isDefault = true;
				}

				if(!isDefault){
					switch(item){
						case "keywords":
							selectors.push(row["name"].toLowerCase());
							selectors.push(row["description"]);
							break;
						case "rulebook":
						//case "edition":
							selectors.push(row[item + "_slug"].toLowerCase());
							break;
						case "prerequisites":
							//selectors.push(row[item + "_slug"].toLowerCase());
							break;
						default:
							//selectors.push(row["name"].toLowerCase());
							break;
					}
				}

				var temp = null;
				for(var s = 0; s < selectors.length; s++){
					if(selectors[s].indexOf(value) > -1){
						temp = true;
					}
				}
				if(temp == null){
					isInRow = false;
				}

				if(isInRow){
					return true;
				} else {
					return false;
				}
			});
		}

		return filteredJson;
	}

	var replaceData = function(item, sourceHtml, json){
		var counter = 0,
            targetHtml = "";

		json.forEach(function(item, i){
			if(counter < dnd.filters.amount){
				var html = sourceHtml;
				var isPrestige = item.prestige == 1 ? true : false;
				var isComponentVerbal = item.verbal_component == 1 ? true : false;
				var isComponentSomatic = item.somatic_component == 1 ? true : false;
				var isComponentArcane = item.arcane_focus_component == 1 ? true : false;
				var isComponentDivine = item.divine_focus_component == 1 ? true : false;
				var isComponentXP = item.xp_component == 1 ? true : false;

				html = dnd.replaceAll(html, '#ID#', item.itemid);
				html = dnd.replaceAll(html, '#NAME#', item.name);
				html = dnd.replaceAll(html, '#ALIAS#', item.slug);
				html = dnd.replaceAll(html, '#DESCRIPTION#', item.description);
				html = dnd.replaceAll(html, '#PRESTIGE#', isPrestige);
				html = dnd.replaceAll(html, '#SPELLSCHOOL#', item.spellschool_name);
				html = dnd.replaceAll(html, '#COMPONENTVERBAL#', isComponentVerbal);
				html = dnd.replaceAll(html, '#COMPONENTSOMATIC#', isComponentSomatic);
				html = dnd.replaceAll(html, '#COMPONENTARCANE#', isComponentArcane);
				html = dnd.replaceAll(html, '#COMPONENTDIVINE#', isComponentDivine);
				html = dnd.replaceAll(html, '#COMPONENTXP#', isComponentXP);
				html = dnd.replaceAll(html, '#BOOK#', item.rulebook_name);
				html = dnd.replaceAll(html, '#EDITION#', item.edition_name);

				html = dnd.replaceAll(html, '#EDITIONURL#', '/edition/' + item.edition_slug);
				html = dnd.replaceAll(html, '#CURRENTURL#', '/' + dnd.menu + '/' + item.slug);
				html = dnd.replaceAll(html, '#URL#', '/rulebook/' + item.rulebook_slug);

				targetHtml += html;
				counter++;
			}
		});

        item.innerHTML = targetHtml;
	}

	var clearTemplate = function(item){
        item.innerHTML = "";
	}
	var loadListTemplate = function(item, template, data){
        var sourceHtml = template.innerHTML,
            hash = window.location.hash.substring(1),
            filteredJson = data;

        if(hash){
            filteredJson = filterData(filteredJson);
        }

        replaceData(item, sourceHtml, filteredJson);
	}
    var loadPageTemplate = function(item, template, data){
        var sourceHtml = template.innerHTML,
            filteredJson = data;

        replaceData(item, sourceHtml, filteredJson);
    }


    dnd.templateData = function(item, template, type, data){
		console.log(item, template);
		console.log(type, data);
        clearTemplate(item);
        if(type == "list"){
            loadListTemplate(item, template, data);
        } else {
            loadPageTemplate(item, template, data);
        }
    }

	dnd.templates = function(){
		dataUrl += dnd.path;
		var loader = dnd.selector("#Loader");
        var templateBaseClass = "-js-template";
        var items = document.getElementsByClassName(templateBaseClass);

		if(items.length < 1){
			loader.style.display = 'none';
			loader.classList.add("is-hidden");
		} else {
			for(var i = 0; i < items.length; i++){
				var item = items[i];
				if(item.classList[1] && item.classList[2]){
					var template = document.getElementById(item.classList[1].replace("-js-","")),
						endpoint = item.getAttribute("data-endpoint"),
						type = item.classList[2].replace("-js-", "");

					if(template && endpoint){
						dnd.data(endpoint, dnd.templateData, item, template, type);
					} else {
						loader.style.display = 'none';
						loader.classList.add("is-hidden");
					}
				} else {
					loader.style.display = 'none';
					loader.classList.add("is-hidden");
				}
			}
		}
    }
	*/

	dnd.templates = function(){
        var templateBaseClass = "-js-template";
        var items = document.getElementsByClassName(templateBaseClass);

		if(items.length > 0){
		}
	}
})();

var dnd = dnd || {};
(function() {
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};
	dnd.path = "localhost:81";

    dnd.vars.localstorage = false;
    dnd.vars.indexeddb = false;

	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

	//prefixes of window.IDB objects
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange


	if (typeof(Storage) !== "undefined") { dnd.vars.localstorage = true; }
    if (window.indexedDB) { dnd.vars.indexeddb = true; }


    dnd.navigation();
    //dnd.filters();
	dnd.data();
    dnd.templates();
})();