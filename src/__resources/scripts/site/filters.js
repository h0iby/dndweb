var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};

	dnd.filters = function(){
		dnd.filters.amount = 25;
		if(dnd.vars.localStorage){
			var tempAmount = localStorage.getItem("filter-amount");
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
				if(dnd.vars.localStorage){
					if(dnd.filters.amount <= 100){
						localStorage.setItem("filter-amount", dnd.filters.amount);
					}
				}
				selectChange(selects, selectValue);
				dnd.templates();
			});
		}

		var selectChange = function(selects, selectValue){
			for(var i = 0; i < selects.length; i++){
				var select = selects[i];
				var options = select.options;
				for(var o = 0; o < options.length; o++) {
					var option = options[o];
					if(option.value == selectValue.toString()) {
						select.selectedIndex = o;
					}
				}
			}
		}
	}
})();