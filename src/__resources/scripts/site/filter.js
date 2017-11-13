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
						if(row[key].toString().indexOf(value) == -1){
							selectors = false;
						}
					} else if(row[key + "_slug"] != null) {
						if(row[key + "_slug"].toString().indexOf(value) == -1){
							selectors = false;
						}
					} else {
						switch(key){
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
								if((row["slug"].toString().indexOf(value) == -1) && (row["description"].toString().indexOf(value) == -1) && (row["benefit"].toString().indexOf(value) == -1) && (row["rulebook_slug"].toString().indexOf(value) == -1)){
									selectors = false;
								}
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