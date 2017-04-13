var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};

	dnd.templates = function(){
		loadListTemplate(".-js-template--" + dnd.menu, "#template--" + dnd.menu, dnd.service[dnd.menu]);
	}

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

	var replaceData = function(templateTarget, sourceHtml, filteredJson){
		var counter = 0,
			targetContainer = dnd.selector(templateTarget);

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

	var clearTemplate = function(templateTarget){
		var target = dnd.selector(templateTarget);
		if(target.length > 0){
			target[0].innerHTML = "";
		}
	}
	var loadListTemplate = function(templateTarget, templateName, templateData){
		clearTemplate(templateTarget);

		var template = dnd.selector(templateName),
			targetContainer = dnd.selector(templateTarget);

		if(template != null && targetContainer.length > 0){
			var sourceHtml = template.innerHTML,
				hash = window.location.hash.substring(1);

			if(templateData != null){
				var filteredJson = templateData;

				if(hash){
					var hashItems = window.location.hash.substring(1).split("&");

					filteredJson = filterData(templateData);
				}

				replaceData(templateTarget, sourceHtml, filteredJson);
			}
		}
	}
})();