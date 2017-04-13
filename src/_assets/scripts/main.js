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
		var newItemValue = value != "" ? item + "=" + value : "";
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
	var getHash = function(){
		var hashItems = window.location.hash.substring(1).split("&");
		for(var i = 0; i < hashItems.length; i++){
			var items = hashItems[i].split("=");
			var item = document.getElementById(items[0]);
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
		var item = document.getElementById(elem);
		var items = 0;
		if(item){
			var ident = elem.replace("filter", "").toLowerCase();
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
		var item = document.getElementById(elem);
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
		if(dnd.vars.hasLocalStorage){
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

				if(dnd.vars.hasLocalStorage){
					localStorage.setItem("filter-amount", dnd.filters.amount);
				}

				dnd.templates();
			});
		}
	}

	dnd.filters = function(){
		populateSelect("filterRulebook");
		populateSelect("filterEdition");
		populateSelect("filterFeat-Category");

		filterInput("filterSlug");
		filterInput("filterKeywords");
		filterInput("filterBenefit");

		filterPageAmount();

		getHash();
	}
})();
var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};

	dnd.templates = function(){
		loadListTemplate(".-js-template--" + dnd.menu, "#template--" + dnd.menu, dnd.service[dnd.menu]);
	}

	var clearTemplate = function(templateTarget){
		var target = dnd.selector(templateTarget);
		if(target.length > 0){
			target[0].innerHTML = "";
		}
	}

	var loadListTemplate = function(templateTarget, templateName, templateData, updateFrom){
		clearTemplate(templateTarget);

		var template = dnd.selector(templateName),
			targetContainer = dnd.selector(templateTarget);

		if(template != null && targetContainer.length > 0){
			var sourceHtml = template.innerHTML,
				currentData = templateData,
				hash = window.location.hash.substring(1),
				counter = 0;

			if(currentData != null){
				var filteredJson = currentData;
				if(hash){
					console.log("need to figure out hash to items - maby switch and do this per item? or auto insert _slug?");
					/*
					var hashItems = window.location.hash.substring(1).split("&");

					filteredJson = currentData.filter(function(row){
						for(var i = 0; i < hashItems.length; i++){
							var items = hashItems[i].split("=");
							if(row[items[0].replace("filter", "").toLowerCase()] != undefined){
								if(row[items[0].replace("filter", "").toLowerCase()].indexOf(items[1]) > -1){
									return true;
								} else {
									return false;
								}
							}
						}
					});
					*/
				}

				filteredJson.forEach(function(item, i){
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

						html = dnd.replaceAll(html, '#EDITIONURL#', '/edition/' + item.edition_id);
						html = dnd.replaceAll(html, '#CURRENTURL#', '/' + dnd.menu + '/' + item.itemid);
						html = dnd.replaceAll(html, '#URL#', '/rulebook/' + item.rulebook_slug);

						dnd.appendTo(targetContainer[0], html);
						counter++;
					}
				});
			}
		}
	}
})();
var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};
	var dataUrl = "http://138.68.114.21";
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


		if(dnd.vars.hasLocalStorage && localStorage.length == 0){
			loadData(true, callback);
		} else if (dnd.vars.hasLocalStorage){
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
		loader.classList.add("is-hidden");
		callback();
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
})();

var dnd = dnd || {};
(function() {
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};

	if (typeof(Storage) !== "undefined") {
		dnd.vars.hasLocalStorage = true;
	} else {
		dnd.vars.hasLocalStorage = false;
	}

	dnd.dataLoaded = function(){
		dnd.filters();
		dnd.templates();
	}
	dnd.initService(dnd.dataLoaded);
})();