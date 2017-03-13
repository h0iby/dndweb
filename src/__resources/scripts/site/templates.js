var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};

	dnd.templates = function(){
		loadTemplate("-js-template-" + dnd.menu, "template-" + dnd.menu + "--header", null, true);
		loadTemplate("-js-template-" + dnd.menu, "template-" + dnd.menu, dnd.service[dnd.menu], false);
	}

	var clearTemplate = function(templateTarget){
		var targetContainer = document.getElementById(templateTarget);

		if(targetContainer != null){
			targetContainer.innerHTML = "";
		}
	}

	var loadTemplate = function(templateTarget, templateName, templateData, templateClearTarget){
		if(templateClearTarget){
			clearTemplate(templateTarget);
		}

		var template = document.getElementById(templateName),
			targetContainer = document.getElementById(templateTarget);

		if(template != null && targetContainer != null){
			var sourceHtml = template.innerHTML,
				currentData = templateData,
				counter = 0;

			if(templateData != null){
				currentData.forEach(function(item, i){
					if(counter < dnd.filters.amount){
						var html = sourceHtml;
						html = html.replace('#NAME#', item.name);
						html = html.replace('#DESCRIPTION#', item.description);
						html = html.replace('#BOOK#', item.rulebook_name);
						targetContainer.insertAdjacentHTML('beforeend', html);
						counter++;
					}
				});
			} else {
				var html = sourceHtml;
				targetContainer.insertAdjacentHTML('beforeend', html);
			}
		}
	}
})();