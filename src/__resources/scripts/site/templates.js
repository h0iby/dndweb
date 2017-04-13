var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};

	dnd.templates = function(){
		loadListTemplate(".-js-template--" + dnd.menu, "#template--" + dnd.menu, dnd.service[dnd.menu]);
	}

	var clearTemplate = function(templateTarget){
		var target = dnd.selector(templateTarget);
		if(target.length > 0){
			target[0].innerHTML = "";
		}
	}

	var loadListTemplate = function(templateTarget, templateName, templateData, updateFrom){
		clearTemplate(templateTarget);

		var template = dnd.selector(templateName),
			targetContainer = dnd.selector(templateTarget);

		if(template != null && targetContainer.length > 0){
			var sourceHtml = template.innerHTML,
				currentData = templateData,
				hash = window.location.hash.substring(1),
				counter = 0;

			if(currentData != null){
				var filteredJson = currentData;
				if(hash){
					console.log("need to figure out hash to items - maby switch and do this per item? or auto insert _slug?");
					/*
					var hashItems = window.location.hash.substring(1).split("&");

					filteredJson = currentData.filter(function(row){
						for(var i = 0; i < hashItems.length; i++){
							var items = hashItems[i].split("=");
							if(row[items[0].replace("filter", "").toLowerCase()] != undefined){
								if(row[items[0].replace("filter", "").toLowerCase()].indexOf(items[1]) > -1){
									return true;
								} else {
									return false;
								}
							}
						}
					});
					*/
				}

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
		}
	}
})();