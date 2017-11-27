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

        window.onscroll = function() {
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
        };
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