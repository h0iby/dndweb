var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};
    var dataUrl = "http://localhost";
    console.log(dataUrl);
    
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

	var replaceData = function(item, sourceHtml, json){
		var counter = 0,
            targetHtml = "";

		json.forEach(function(item, i){
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

				html = dnd.replaceAll(html, '#EDITIONURL#', '/edition/' + item.edition_slug);
				html = dnd.replaceAll(html, '#CURRENTURL#', '/' + dnd.menu + '/' + item.slug);
				html = dnd.replaceAll(html, '#URL#', '/rulebook/' + item.rulebook_slug);

				targetHtml += html;
				counter++;
			}
		});
        
        item.innerHTML = targetHtml;
	}

	var clearTemplate = function(item){
        item.innerHTML = "";
	}
	var loadListTemplate = function(item, template, data){
        var sourceHtml = template.innerHTML,
            hash = window.location.hash.substring(1),
            filteredJson = data;

        if(hash){
            filteredJson = filterData(filteredJson);
        }

        replaceData(item, sourceHtml, filteredJson);
	}
    var loadPageTemplate = function(item, template, data){
        var sourceHtml = template.innerHTML,
            filteredJson = data;
        
        replaceData(item, sourceHtml, filteredJson);
    }
    
    
    dnd.templateData = function(item, template, type, data){
        clearTemplate(item);
        if(type == "list"){
            loadListTemplate(item, template, data);
        } else {
            loadPageTemplate(item, template, data);
        }
    }
    dnd.templates = function(){
        var templateBaseClass = "-js-template";
        var items = document.getElementsByClassName(templateBaseClass);
        
        for(var i = 0; i < items.length; i++){
            var item = items[i];
            if(item.classList[1] && item.classList[2]){
                var template = document.getElementById(item.classList[1].replace("-js-","")),
                    endpoint = item.getAttribute("data-endpoint"),
                    type = item.classList[2].replace("-js-", "");

                if(template && endpoint){
                    dnd.data(endpoint, dnd.templateData, item, template, type);
                }
            }
        }
    }
})();