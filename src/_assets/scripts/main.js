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
	dnd.getHash = function(item){
		if(window.location.hash && item != null){
			var itemValue = "";
			var hashItems = window.location.hash.substring(1).split("&");
			for(var i = 0; i < hashItems.length; i++){
				var hashes = hashItems[i].split("=");
				if(hashes[0] == item){
					itemValue = hashes[1];
				}
			}
			return itemValue;
		} else {
			return window.location.hash;
		}
	}
})();
var dnd = dnd || {};
(function() {
	"use strict";
	var filters = function(){
		var hash = window.location.hash.substring(1);
		var filterToggle = document.getElementsByClassName("filter__toggle");

		if(filterToggle){
			for(var i = 0; i < filterToggle.length; i++){
				if(dnd.vars.modern){
					filterToggle[i].addEventListener('change',function(){
						localStorage.setItem('filterIsShown', this.checked.toString());
					});
				}

				if((hash != "" && hash != null) || (localStorage.getItem('filterIsShown') == "true")){
					if((hash.indexOf("filter=no") > -1)){
						filterToggle[i].checked = false;
					} else{
						filterToggle[i].checked = true;
					}
				}
			}
		}
	}
	var topNav = function(){
		var scrollPos = 0;
        var resizeTimer;
        var header = document.getElementById("Header");
        var headerHeight = header.offsetHeight + 5;

		window.addEventListener('scroll', function(){
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function () {
				if(window.pageYOffset < scrollPos){
					header.classList.remove("is-hidden");
				} else {
					if(!document.getElementById("navigationOn").checked){
						header.classList.add("is-hidden");
					}
				}
				scrollPos = window.pageYOffset;
				dnd.vars.scollPos = Math.floor(scrollPos);
				localStorage.setItem("scrollPos", Math.floor(scrollPos));
			}, 100);
		});
	}
	dnd.loader = function(mode){
		var loader = dnd.selector("#Loader");
		if(mode){
			loader.classList.remove("is-hidden");
		} else {
			loader.classList.add("is-hidden");
		}
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
var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};

	var templateScroll = function(){
		window.scroll(0,dnd.vars.scollPos);
	}

	var templateClear = function(item){
		item.innerHTML = "";
	}
	var templateLoad = function(item, data, template){
		if(item.getAttribute("data-reset") == "true"){
			templateClear(item);
		}
		var isList = document.getElementsByClassName("-js-amount-sorting").length > 0,
			isRestricted = item.getAttribute("data-output") != null,
			hasPaging = dnd.getHash("page") != "";

		var templateHtml = template.innerHTML,
			counter = 0,
            itemHtml = "",
			filters = dnd.filters.amount != null ? dnd.filters.amount : 25,
			lists = isList ? filters : 999999,
			dataOutput = isRestricted ? Math.floor(item.getAttribute("data-output")) : lists,
			count = isList && !isRestricted && hasPaging ? Math.floor(dataOutput) * Math.floor(dnd.getHash("page")) : Math.floor(dataOutput);

		data.forEach(function(obj, i){
			if(counter < count){
				var html = templateHtml;

				var isPrestige = obj.prestige == 1 ? true : false;
				var isComponentVerbal = obj.verbal_component == 1 ? true : false;
				var isComponentSomatic = obj.somatic_component == 1 ? true : false;
				var isComponentArcane = obj.arcane_focus_component == 1 ? true : false;
				var isComponentDivine = obj.divine_focus_component == 1 ? true : false;
				var isComponentXP = obj.xp_component == 1 ? true : false;

				var isTrainedOnly = obj.trained_only == 1 ? true : false;
				var hasCheckPenalty = obj.armor_check_penalty == 1 ? true : false;

				html = dnd.replaceAll(html, '¤ID¤', obj.itemid);
				html = dnd.replaceAll(html, '¤NAME¤', obj.name);
				html = dnd.replaceAll(html, '¤ALIAS¤', obj.slug);

				html = dnd.replaceAll(html, '¤DESCRIPTION¤', obj.description);
				html = dnd.replaceAll(html, '¤DESCRIPTIONHTML¤', obj.description_html);
				html = dnd.replaceAll(html, '¤SHORTDESCRIPTION¤', obj.short_description);
				html = dnd.replaceAll(html, '¤SHORTDESCRIPTIONHTML¤', obj.short_description_html);

				html = dnd.replaceAll(html, '¤CLASSFEATURES¤', obj.class_features);
				html = dnd.replaceAll(html, '¤CLASSFEATURESHTML¤', obj.class_features_html != "" && obj.class_features_html != null ? '<h3>Features</h3>' + obj.class_features_html : "");
				html = dnd.replaceAll(html, '¤ADVANCEMENT¤', obj.advancement);
				html = dnd.replaceAll(html, '¤ADVANCEMENTHTML¤', obj.advancement_html != "" && obj.advancement_html != null ? '<h3>Advancement</h3>' + obj.advancement_html : "");
				html = dnd.replaceAll(html, '¤PRESTIGE¤', isPrestige);

				html = dnd.replaceAll(html, '¤BENEFIT¤', obj.benefit);
				html = dnd.replaceAll(html, '¤SPECIAL¤', obj.special != "" && obj.special != null ? "<h4>Special</h4><p>" + obj.special + "</p>" : "");
				html = dnd.replaceAll(html, '¤NORMAL¤', obj.normal != "" && obj.normal != null ? "<h4>Normal</h4><p>" + obj.normal + "</p>" : "");

				html = dnd.replaceAll(html, '¤ABILITY¤', obj.base_skill != "" && obj.base_skill != null ? obj.base_skill.toLowerCase() : "");
				html = dnd.replaceAll(html, '¤CHECKHTML¤', obj.check_html != "" && obj.check_html != null ? '<h3>Check</h3>' + obj.check_html : "");
				html = dnd.replaceAll(html, '¤SYNERGYHTML¤', obj.synergy_html != "" && obj.synergy_html != null ? '<h3>Synergy</h3>' + obj.synergy_html : "");
				html = dnd.replaceAll(html, '¤ACTIONHTML¤', obj.action_html != "" && obj.action_html != null ? '<h3>Action</h3>' + obj.action_html : "");
				html = dnd.replaceAll(html, '¤TRYAGAINHTML¤', obj.try_again_html != "" && obj.try_again_html != null ? '<h3>Try again</h3>' + obj.try_again_html : "");
				html = dnd.replaceAll(html, '¤SPECIALHTML¤', obj.special_html != "" && obj.special_html != null ? '<h3>Special</h3>' + obj.special_html : "");
				html = dnd.replaceAll(html, '¤UNTRAINEDHTML¤', obj.untrained_html != "" && obj.untrained_html != null ? '<h3>Untrained</h3>' + obj.untrained_html : "");

				html = dnd.replaceAll(html, '¤SPELLSCHOOL¤', obj.spellschool_name);
				html = dnd.replaceAll(html, '¤COMPONENTVERBAL¤', isComponentVerbal);
				html = dnd.replaceAll(html, '¤COMPONENTSOMATIC¤', isComponentSomatic);
				html = dnd.replaceAll(html, '¤COMPONENTARCANE¤', isComponentArcane);
				html = dnd.replaceAll(html, '¤COMPONENTDIVINE¤', isComponentDivine);
				html = dnd.replaceAll(html, '¤COMPONENTXP¤', isComponentXP);
				html = dnd.replaceAll(html, '¤MINRANKS¤', obj.min_rank);
				html = dnd.replaceAll(html, '¤TRAINED¤', isTrainedOnly);
				html = dnd.replaceAll(html, '¤PENALTY¤', hasCheckPenalty);

				html = dnd.replaceAll(html, '¤EDITION¤', obj.edition_name);
				html = dnd.replaceAll(html, '¤EDITIONALIAS¤', obj.edition_slug);
				html = dnd.replaceAll(html, '¤EDITIONURL¤', '/edition/' + obj.edition_slug);
				html = dnd.replaceAll(html, '¤BOOK¤', obj.rulebook_name);
				html = dnd.replaceAll(html, '¤BOOKALIAS¤', obj.rulebook_slug);
				html = dnd.replaceAll(html, '¤BOOKURL¤', '/rulebook/' + obj.rulebook_slug);
				html = dnd.replaceAll(html, '¤BOOKPAGE¤', obj.page != null ? " (p. " + obj.page + ")" : "");

				html = dnd.replaceAll(html, '¤CURRENTURL¤', '/' + item.getAttribute("data-item") + '/' + obj.slug);


				itemHtml += html;
				counter++;
			}
		});
		item.innerHTML = itemHtml;

		if(isList && item.classList.contains("-js-list")){
			templateScroll();
		}
	}
	var templateInit = function(item, data){
		var template = document.getElementById(item.classList[1].replace("-js-",""));
		if(item && data && template){
			dnd.filters(data.length);
			templateLoad(item, data, template);
			item.setAttribute("data-loaded", "true");
		}
	}
	dnd.template = function(item, output){
		var data = output,
			hash = window.location.hash.substring(1);
		if(hash != "" && hash != null){
			data = dnd.filter(data);
		}
		templateInit(item, data);
		dnd.loader(false);
	}
	dnd.templates = function(item){
		var items = [],
			templateBaseClass = "-js-template";

		if(item != null){
			templateBaseClass += "--" + item;
		}

		items = document.getElementsByClassName(templateBaseClass);

		if(items.length > 0){
			dnd.loader(true);
			var count = 0;
			for(var i = 0; i < items.length; i++){
				if(items[i].getAttribute("data-endpoint") != null && items[i].getAttribute("data-endpoint") != ""){
					dnd.data(dnd.template, items[i]);
					count++;
				} else if(items[i].getAttribute("data-endpoint") != null && items[i].getAttribute("data-endpoint") != ""){
					count++;
			  	}
			}
			if(count == 0){
				dnd.loader(false);
			}
		} else {
			dnd.loader(false);
		}
	}
})();
var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	var timeoutTimer = 1000;
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
	var getHash = function(item){
		if(window.location.hash){
			var hashItems = window.location.hash.substring(1).split("&");
			for(var i = 0; i < hashItems.length; i++){
				var hashes = hashItems[i].split("=");
				var items = document.querySelectorAll("[data-select='"+ hashes[0] +"'], [data-manual='"+ hashes[0] +"']");
				for(var o = 0; o < items.length; o++){
					var item = items[o];
					if(item){
						switch(item.tagName.toLowerCase()){
							case "select":
								setSelect(item, hashes[1]);//dnd.replaceAll(, "-", " ")
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

	var selectManual = function(item){
		var obj = item.getAttribute("data-manual");

		item.addEventListener('change',function(){
			var select = this;
			var selectValue = select.options[select.selectedIndex].value;
			setHash(obj, selectValue);
			dnd.templates(item.getAttribute("data-target"));
		});
	}
	var selectData = function(item, output){
		var json = output,
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
					dnd.templates(item.getAttribute("data-target"));
				});
			}
		}
	}
	var selectInit = function(item, mode){
		if(mode){
			var ident = item.getAttribute("data-select");
			item.setAttribute("data-type", ident);
			item.setAttribute("data-item", ident);
			item.setAttribute("data-endpoint", "/" + ident);
			dnd.data(selectData, item);
		} else {
			selectManual(item);
		}
		if(window.location.hash){
			getHash();
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
						dnd.templates(item.getAttribute("data-target"));
					}, timeoutTimer)
				});
			}
		}
		if(window.location.hash){
			getHash();
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
						setHash(obj, item.getAttribute("data-radio"));
						dnd.templates(item.getAttribute("data-target"));
					}, 50)
				});
			}
		}
		if(window.location.hash){
			getHash();
		}
	}
	var filterPageAmount = function(amount){
		dnd.filters.amount = 25;
		if(dnd.vars.modern){
			if(localStorage.getItem("filterAmount") == null){
				localStorage.setItem("filterAmount", dnd.filters.amount);
			} else {
				dnd.filters.amount = parseInt(localStorage.getItem("filterAmount"));
			}
		}

		var selects = dnd.selector(".-js-amount-sorting");
		for(var i = 0; i < selects.length; i++){
			var select = selects[i];
			var options = select.options;
			var containers = dnd.selector(".-js-amount-page");
			for(var o = 0; o < options.length; o++) {
				var option = options[o];
				if(option.value == dnd.filters.amount.toString()) {
					select.selectedIndex = o;
				}
			}

			for(var o = 0; o < containers.length; o++){
				var container = containers[o]
				if(amount <= Math.floor(options[0].value)){
					container.classList.add('table-amount--hidden');
				}
			}

			if(!select.hasAttribute("data-load")){
				select.setAttribute("data-load", amount);
				select.addEventListener('change',function(){
					var selectValue = this.options[this.selectedIndex].value;
					dnd.filters.amount = parseInt(selectValue);

					if(dnd.vars.localstorage){
						localStorage.setItem("filterAmount", dnd.filters.amount);
					}

					dnd.templates();
				});
			}
		}
	}
	var filterPageLoad = function(amount){
		if(amount < dnd.filters.amount){
			var containers = dnd.selector(".-js-amount-pager");
			for(var i = 0; i < containers.length; i++){
				var container = containers[i];
				container.classList.add("table-pager--hidden");
			}
		} else {
			var loaders = dnd.selector(".-js-amount-load");
			for(var i = 0; i < loaders.length; i++){
				var loader = loaders[i];

				if(dnd.getHash("page") != ""){
					var containers = dnd.selector(".-js-amount-pager");
					for(var i = 0; i < containers.length; i++){
						var container = containers[i];
						container.classList.add("table-pager--hidden");
					}
				}

				if(!loader.hasAttribute("data-load")){
					loader.setAttribute("data-load", amount);
					loader.addEventListener('click',function(event){
						event.preventDefault();
						var currentPage = Math.floor(dnd.getHash("page"));
						if(dnd.getHash("page") != ""){
							currentPage++;
						} else {
							currentPage = 2;
						}
						setHash("page", currentPage.toString());
						dnd.templates();
					});
				}
			}
		}
	}
	var filterWindowScroll = function(amount){
		var scrollPos = 0,
			timeout = 250,
        	timer;

		window.addEventListener('scroll', function(){
			var body = document.body,
    			html = document.documentElement,
				offSet = 500;

			var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
			var currentHeight = height - window.outerHeight - offSet;
			var currentPos = window.pageYOffset;
			var listItems = dnd.selector(".-js-list")[0].getElementsByClassName("table__row");

            if(currentPos > currentHeight){
				if(timer) {
					window.clearTimeout(timer);
				}

				timer = window.setTimeout(function() {
					if(dnd.getHash("page") != ""){
						if(listItems.length >= Math.floor(dnd.getHash("page")) * dnd.filters.amount){
							var currentPage = Math.floor(dnd.getHash("page"));
							currentPage++;
							setHash("page", currentPage.toString());
							dnd.templates();
						}
					}
				}, timeout);
            }
            scrollPos = window.pageYOffset;
        });
	}
	dnd.filters = function(amount){
		filterPageAmount(amount);
		filterPageLoad(amount);
		filterWindowScroll(amount);
		setTimeout(function(){
			var selectors = dnd.selector(".filter__list__item__container__select");
			for(var i = 0; i < selectors.length; i++){
				var item = selectors[i];
				if(item.hasAttribute("data-select") && item.getAttribute("data-select") != ""){
					selectInit(item, true);
				} else if(item.hasAttribute("data-manual") && item.getAttribute("data-manual") != ""){
					selectInit(item, false);
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
		},1)
	}
})();
var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.filter = function(data){
		var output = data, hashItems = window.location.hash.substring(1).split("&");
		if(hashItems.length > 0) {
			output = data.filter(function(row){
				var selectors = true;

				for(var i = 0; i < hashItems.length; i++){
					var items = hashItems[i].split("="),
						key = items[0].toLowerCase(),
						value = items[1];

					if(row[key] != null){
						if(row[key].toString().toLowerCase().indexOf(value) == -1){
							selectors = false;
						}
					} else if(row[key + "_slug"] != null) {
						if(row[key + "_slug"].toString().indexOf(value) == -1){
							selectors = false;
						}
					} else if(key.indexOf("__min") > -1) {
						var keyCurrent = key.replace("__min","");
						if(row[keyCurrent] == null || isNaN(Number(value))){
							selectors = false;
						} else{
							if(isNaN(row[keyCurrent])){
								selectors = false;
							} else if(row[keyCurrent] == 0){
								selectors = false;
							} else if(row[keyCurrent] < Number(value)){
								selectors = false;
							}
						}
					} else if(key.indexOf("__max") > -1) {
						var keyCurrent = key.replace("__max","");
						if(row[keyCurrent] == null || isNaN(Number(value))){
							selectors = false;
						} else{
							if(isNaN(row[keyCurrent])){
								selectors = false;
							} else if(row[keyCurrent] == 0){
								selectors = false;
							} else if(row[keyCurrent] > Number(value)){
								selectors = false;
							}
						}
					} else {
						switch(key){
							case "ability":
								if(row["base_skill"].toLowerCase().indexOf(value) == -1){
									selectors = false;
								}
								break;
							case "spell-school":
								if(row["spellschool_slug"] != null){
									if(row["spellschool_slug"].toString().indexOf(value) == -1){
										selectors = false;
									}
								} else {
									selectors = false;
								}
								break;
							case "spell-subschool":
								if(row["spellsubschool_slug"] != null){
									if(row["spellsubschool_slug"].toString().indexOf(value) == -1){
										selectors = false;
									}
								} else {
									selectors = false;
								}
								break;
							case "verbal":
								if(row["verbal_component"].toString().indexOf(value) == -1){
									selectors = false;
								}
								break;
							case "somatic":
								if(row["somatic_component"].toString().indexOf(value) == -1){
									selectors = false;
								}
								break;
							case "materialcomponent":
								if(row["material_component"].toString().indexOf(value) == -1){
									selectors = false;
								}
								break;
							case "arcanefocus":
								if(row["arcane_focus_component"].toString().indexOf(value) == -1){
									selectors = false;
								}
								break;
							case "divinefocus":
								if(row["divine_focus_component"].toString().indexOf(value) == -1){
									selectors = false;
								}
								break;
							case "xpcomponent":
								if(row["xp_component"].toString().indexOf(value) == -1){
									selectors = false;
								}
								break;
							case "keywords":
								if((row["slug"].toString().indexOf(value) == -1) && (row["description"].toString().indexOf(value) == -1) && (row["benefit"].toString().indexOf(value) == -1)){
									selectors = false;
								}
								break;
							case "features":
								console.log("features");
								if((row["slug"].toString().indexOf(value) == -1) && (row["advancement"].toString().indexOf(value) == -1) && (row["class_features"].toString().indexOf(value) == -1)){
									selectors = false;
								}
								break;
							default:
								break;
						}
					}
				}
				//if(selectors){ console.log(key, row); }
				return selectors;
			});
		}
		return output;
	}
})();

var dnd = dnd || {};
(function() {
	dnd.vars = dnd.vars || {};
	dnd.path = "localhost:81";
    dnd.vars.localstorage = false;
    dnd.vars.indexeddb = false;
	dnd.vars.modern = false;
	dnd.vars.listrun = false;
	dnd.vars.scollPos = localStorage.getItem("scrollPos");
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
	if (typeof(Storage) !== "undefined") { dnd.vars.localstorage = true; }
    if (window.indexedDB) { dnd.vars.indexeddb = true; }
	if(dnd.vars.indexeddb && dnd.vars.localstorage){ dnd.vars.modern = true; }
	var dataIsLoaded = function(){
		dnd.loader(false);
		dnd.templates(null);

		var dataSlow = document.querySelectorAll('[data-slow]');
		for(var i = 0; i < dataSlow.length; i++){
			var item = dataSlow[i];
			item.setAttribute("style", "background-image: url('" + item.getAttribute("data-slow") + "');");
		}
	}
    dnd.navigation();
	dnd.data(dataIsLoaded, null);
})();