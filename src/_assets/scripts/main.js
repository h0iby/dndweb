var dnd = dnd || {};
(function() {
	"use strict";
	dnd.ajax = function(mode, url, successFunction, errorFunction){
		var request = new XMLHttpRequest();
		request.open('GET', url);
		request.onload = function() {
			if(!mode){
				if (request.status >= 200 && request.status < 400) {
					successFunction(request.responseText);
				} else {
					errorFunction();
				}
			}
		};
		request.onloadend = function(){
			if(mode){
				if (request.status >= 200 && request.status < 400) {
					successFunction(request.responseText);
				} else {
					errorFunction();
				}
			}
		}
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
			}
			else {
				if(hash.indexOf("&") < 0){
					if(hash.indexOf(item) > -1){
						history.pushState(null, null, " ");
					}
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
	var filters = function(){
		var hash = window.location.hash.substring(1);

		if(hash != "" && hash != null){
			var filterToggle = document.getElementsByClassName("filter__toggle");
			if(filterToggle){
				filterToggle[0].checked = true;
			}
		}
	}
	var topNav = function(){
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
    dnd.navigation = function(){
		topNav();
		filters();
    }
})();
var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};
	var setSelect = function(item, value){
		var select = item;
		if(select){
			var options = select.options;
			for(var o = 0; o < options.length; o++) {
				var option = options[o];
				if(option.value == value.toString()) {
					select.selectedIndex = o;
				}
			}
		}
	}
	var setInputs = function(item, value){
		var input = item;
		input.value = value;
	}
	var setRadiobuttons = function(item){
		item.checked = true;
	}
	var setHash = function(item, value){
		dnd.setHash(item, dnd.replaceAll(value, " ", "-"));
	}
	var getHash = function(){
		if(window.location.hash){
			var hashItems = window.location.hash.substring(1).split("&");
			for(var i = 0; i < hashItems.length; i++){
				var hashes = hashItems[i].split("=");
				var items = document.querySelectorAll("[data-select='"+ hashes[0] +"']");
				for(var o = 0; o < items.length; o++){
					var item = items[o];
					if(item){
						switch(item.tagName.toLowerCase()){
							case "select":
								setSelect(item, dnd.replaceAll(hashes[1], "-", " "));
								break;
							default:
								if(item.hasAttribute("data-radio")){
									var value = item.getAttribute("data-radio")
									if(value == hashes[1]){
										setRadiobuttons(item);
									}
								} else {
									setInputs(item, dnd.replaceAll(hashes[1], "-", " "));
								}
								break;
						}
					}
				}
			}
		}
	}
	var selectItem = function(item){
		var json = dnd.service[item.getAttribute("data-type")],
			obj = item.getAttribute("data-select"),
			first = document.createElement("option"),
			items = json.length;

		if(!item.hasAttribute("data-loaded")){
			first.value = "";
			first.innerHTML = "";
			item.appendChild(first);
		}
		if(items > 0){
			if(!item.hasAttribute("data-loaded")){
				item.setAttribute("data-loaded", "true");
				for(var i = 0; i < json.length; i++){
					var option = document.createElement("option");
					option.value= json[i].slug;
					option.innerHTML = json[i].name;
					item.appendChild(option);
				}
				item.addEventListener('change',function(){
					var select = this;
					var selectValue = select.options[select.selectedIndex].value;
					setHash(obj, selectValue);
					dnd.templates(document.getElementsByClassName("-js-template--" + item.getAttribute("data-target"))[0]);
				});
			}
		}
	}
	var selectData = function(item, obj){
		var ident = obj.toLowerCase();

		item.setAttribute("data-type", ident);
		item.setAttribute("data-item", ident);
		item.setAttribute("data-endpoint", "/" + ident);

		dnd.data(item, selectItem);
	}
	var selectInit = function(item){
		var obj = item.getAttribute("data-select");
		if(item && obj){
			var ident = obj.toLowerCase(),
				json = dnd.service[ident];

			if(json == null){
				selectData(item, obj);
			} else {
				selectItem(item);
			}
		}
	}
	var filterInput = function(item){
		var obj = item.getAttribute("data-select");
		if(item && obj){
			var timeout;
			if(!item.hasAttribute("data-loaded")){
				item.setAttribute("data-loaded", "true");
				item.addEventListener('keyup',function(){
					if(timeout) {
						clearTimeout(timeout);
						timeout = null;
					}
					timeout = setTimeout(function(){
						setHash(obj, item.value);
						dnd.templates(document.getElementsByClassName("-js-template--" + item.getAttribute("data-target"))[0]);
					}, 750)
				});
			}
		}
	}
	var filterRadiobutton = function(item){
		var obj = item.getAttribute("data-select");
		if(item && obj){
			var timeout;
			if(!item.hasAttribute("data-loaded")){
				item.setAttribute("data-loaded", "true");
				item.addEventListener('change',function(){
					if(timeout) {
						clearTimeout(timeout);
						timeout = null;
					}
					timeout = setTimeout(function(){
						var value = "";
						if(item.hasAttribute("data-radio")){
							value = item.getAttribute("data-radio");
						}
						setHash(obj, value);
						dnd.templates(document.getElementsByClassName("-js-template--" + item.getAttribute("data-target"))[0]);
					}, 1)
				});
			}
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
		filterPageAmount();
		setTimeout(function(){
			var selectors = dnd.selector(".filter__list__item__container__select");
			for(var i = 0; i < selectors.length; i++){
				var item = selectors[i];
				if(item.hasAttribute("data-select") && item.getAttribute("data-select") != ""){
					selectInit(item);
				}
			}
			selectors = dnd.selector(".filter__list__item__container__input");
			for(var i = 0; i < selectors.length; i++){
				var item = selectors[i];
				if(item.hasAttribute("data-select") && item.getAttribute("data-select") != ""){
					filterInput(item);
				}
			}
			selectors = dnd.selector(".filter__list__item__container__radiobutton");
			for(var i = 0; i < selectors.length; i++){
				var item = selectors[i];
				if(item.hasAttribute("data-select") && item.getAttribute("data-select") != ""){
					filterRadiobutton(item);
				}
			}

			getHash();
		},1)
	}
})();
var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};
	dnd.filter = function(data){
		var output = data,
			hashItems = window.location.hash.substring(1).split("&");
		if(hashItems.length > 0) {
			output = data.filter(function(row){
				var selectors = true;
				for(var i = 0; i < hashItems.length; i++){
					var items = hashItems[i].split("="),
						key = items[0].toLowerCase(),//.substr(6,(items[0].length-6)),
						value = items[1];

					if(row[key] != null){
						if(row[key].toString().indexOf(value) == -1){
							selectors = false;
						}
					} else if(row[key + "_slug"] != null) {
						if(row[key + "_slug"].toString().indexOf(value) == -1){
							selectors = false;
						}
					} else {
						switch(key){
							case "keywords":
								//console.log("keywords")
								break;
							case "prerequisites":
								//console.log("prerequisites")
								break;
							default:
								break;
						}
					}
				}
				if(selectors){ return true; } else { return false; }
			});
		}
		return output;
	}
})();
var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};
	var idb,
		idbName = "dndDB",
		http = "http://",
		url = "";
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
var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};
	var templateLoader = function(mode){
		var loader = dnd.selector("#Loader");
		if(mode){
			loader.style.display = 'block';
			loader.classList.remove("is-hidden");
		} else {
			loader.style.display = 'none';
			loader.classList.add("is-hidden");
		}
	}
	var templateClear = function(item){
		item.innerHTML = "";
	}
	var templateLoad = function(item, data, template){
		var templateHtml = template.innerHTML,
			counter = 0,
            itemHtml = "",
			count = dnd.filters.amount != null ? dnd.filters.amount : 25;

		templateClear(item);
		data.forEach(function(obj, i){

			if(counter < count){
				var html = templateHtml;

				var isPrestige = obj.prestige == 1 ? true : false;
				var isComponentVerbal = obj.verbal_component == 1 ? true : false;
				var isComponentSomatic = obj.somatic_component == 1 ? true : false;
				var isComponentArcane = obj.arcane_focus_component == 1 ? true : false;
				var isComponentDivine = obj.divine_focus_component == 1 ? true : false;
				var isComponentXP = obj.xp_component == 1 ? true : false;

				html = dnd.replaceAll(html, '#ID#', obj.itemid);
				html = dnd.replaceAll(html, '#NAME#', obj.name);
				html = dnd.replaceAll(html, '#ALIAS#', obj.slug);
				html = dnd.replaceAll(html, '#DESCRIPTION#', obj.description);
				html = dnd.replaceAll(html, '#PRESTIGE#', isPrestige);
				html = dnd.replaceAll(html, '#SPELLSCHOOL#', obj.spellschool_name);
				html = dnd.replaceAll(html, '#COMPONENTVERBAL#', isComponentVerbal);
				html = dnd.replaceAll(html, '#COMPONENTSOMATIC#', isComponentSomatic);
				html = dnd.replaceAll(html, '#COMPONENTARCANE#', isComponentArcane);
				html = dnd.replaceAll(html, '#COMPONENTDIVINE#', isComponentDivine);
				html = dnd.replaceAll(html, '#COMPONENTXP#', isComponentXP);
				html = dnd.replaceAll(html, '#BOOK#', obj.rulebook_name);
				html = dnd.replaceAll(html, '#EDITION#', obj.edition_name);

				html = dnd.replaceAll(html, '#EDITIONURL#', '/edition/' + obj.edition_slug);
				html = dnd.replaceAll(html, '#CURRENTURL#', '/' + item.getAttribute("data-item") + '/' + obj.slug);
				html = dnd.replaceAll(html, '#URL#', '/rulebook/' + obj.rulebook_slug);
				html = dnd.replaceAll(html, '#BOOKURL#', '/rulebook/' + obj.rulebook_slug);

				itemHtml += html;
				counter++;
			}
		});
		item.innerHTML = itemHtml;
	}
	var templateInit = function(item, data){
		var template = document.getElementById(item.classList[1].replace("-js-",""));
		templateLoader(false);
		if(item && data && template){
			templateLoad(item, data, template);
			dnd.filters();
		}
	}
	dnd.templates = function(item){
		var items = [],
			templateBaseClass = "-js-template";
		if(item != null){
			templateBaseClass += "--" + item.getAttribute("data-item")
			items = document.getElementsByClassName(templateBaseClass);
		} else {
			items = document.getElementsByClassName(templateBaseClass);
		}
		if(items.length > 0){
			for(var i = 0; i < items.length; i++){
				if(item != null){
					dnd.template(items[i], dnd.service[item.getAttribute("data-type")]);
				} else {
					dnd.data(items[i], dnd.template);
				}
			}
		} else {
			templateLoader(false);
		}
	}
	dnd.template = function(item, output){
		var data = output,
			hash = window.location.hash.substring(1);
		if(hash != "" && hash != null){
			data = dnd.filter(data);
		}
		templateInit(item, data);
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
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
	if (typeof(Storage) !== "undefined") { dnd.vars.localstorage = true; }
    if (window.indexedDB) { dnd.vars.indexeddb = true; }
    dnd.navigation();
	dnd.templates();
})();