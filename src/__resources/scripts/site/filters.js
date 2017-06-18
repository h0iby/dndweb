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

	var setHash = function(item, value){
		dnd.setHash(item, value);
	}
	var getHash = function(type){
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

	var selectItem = function(item){
		var json = dnd.service[item.getAttribute("data-type")],
			obj = item.getAttribute("id"),
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
			getHash();
		}
	}
	var selectData = function(item, obj){
		var ident = obj.toLowerCase();
		item.setAttribute("data-type", ident);
		item.setAttribute("data-item", ident);
		item.setAttribute("data-endpoint", "/" + ident);
		dnd.data(item, selectItem);
	}
	var selectInit = function(obj){
		var item = document.getElementById("filter" + obj);
		if(item){
			var ident = obj.toLowerCase(),
				json = dnd.service[ident];
			if(json == null){
				selectData(item, obj);
			} else {
				selectItem(item);
			}
		}
	}

	var filterInput = function(obj){
		var item = document.getElementById("filter" + obj);
		if(item){
			var timeout;
			item.addEventListener('change',function(){
				if(timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				timeout = setTimeout(function(){
					setHash(obj, item.value);
					dnd.templates(document.getElementsByClassName("-js-template--" + item.getAttribute("data-target"))[0]);
				}, 500)
			});

			getHash();
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

		selectInit("Rulebook");
		selectInit("Edition");
		selectInit("Feat-Category");

		filterInput("Slug");
		filterInput("Keywords");
		filterInput("Benefit");
	}
	dnd.filter = function(data){
		var output = data,
			hashItems = window.location.hash.substring(1).split("&");

		for(var i = 0; i < hashItems.length; i++){
			var items = hashItems[i].split("="),
				item = items[0].toLowerCase().substr(6,(items[0].length-6)),
				value = items[1],
				isDefault = false;

			output = data.filter(function(row){
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

		return output;
	}
})();