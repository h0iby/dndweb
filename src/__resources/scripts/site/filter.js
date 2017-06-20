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
						key = items[0].toLowerCase().substr(6,(items[0].length-6)),
						value = items[1];
					if(row[key] != null){
						if(row[key].indexOf(value) == -1){
							selectors = false;
						}
					} else if(row[key + "_slug"] != null) {
						if(row[key + "_slug"].indexOf(value) == -1){
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