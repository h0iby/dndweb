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