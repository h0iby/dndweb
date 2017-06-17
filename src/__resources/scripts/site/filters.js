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
		var item = document.getElementById("filter" + elem),
			items = 0;

		if(item){
			var ident = elem.toLowerCase(),
				json = dnd.service[ident];



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
			} else {
				item.setAttribute("data-type", ident)
				item.setAttribute("data-item", ident)
				item.setAttribute("data-endpoint", "/" + ident)
				dnd.data(item, dnd.filters);
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
		filterPageAmount();

		/*
		populateSelect("Rulebook");
		populateSelect("Edition");
		populateSelect("Feat-Category");

		filterInput("Slug");
		filterInput("Keywords");
		filterInput("Benefit");


		getHash();
		*/

	}
	dnd.filter = function(data){
		var output = data,
			hashItems = window.location.hash.substring(1).split("&");

		/*
		for(var i = 0; i < hashItems.length; i++){
			var items = hashItems[i].split("=");
			var item = items[0].toLowerCase();
			var value = items[1]
			var isDefault = false;

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
		*/
		return output;
	}

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
	*/
})();