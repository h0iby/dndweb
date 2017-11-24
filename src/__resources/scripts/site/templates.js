var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};
	var templateClear = function(item){
		item.innerHTML = "";
	}
	var templateLoad = function(item, data, template){
		if(item.getAttribute("data-reset") == "true"){
			templateClear(item);
		}
		var templateHtml = template.innerHTML,
			counter = 0,
            itemHtml = "",
			filters = dnd.filters.amount != null ? dnd.filters.amount : 25,
			dataOutput = item.getAttribute("data-output") != null ? Math.floor(item.getAttribute("data-output")) : filters,
			running = document.getElementsByClassName("-js-sorting-amount").length > 0 ? dataOutput : 999999,
			count = running;

		data.forEach(function(obj, i){
			if(counter < count){
				var html = templateHtml;

				var isPrestige = obj.prestige == 1 ? true : false;
				var isComponentVerbal = obj.verbal_component == 1 ? true : false;
				var isComponentSomatic = obj.somatic_component == 1 ? true : false;
				var isComponentArcane = obj.arcane_focus_component == 1 ? true : false;
				var isComponentDivine = obj.divine_focus_component == 1 ? true : false;
				var isComponentXP = obj.xp_component == 1 ? true : false;

				var isTrainedOnly = obj.trained_only == 1 ? true : false;
				var hasCheckPenalty = obj.armor_check_penalty == 1 ? true : false;

				html = dnd.replaceAll(html, '¤ID¤', obj.itemid);
				html = dnd.replaceAll(html, '¤NAME¤', obj.name);
				html = dnd.replaceAll(html, '¤ALIAS¤', obj.slug);

				html = dnd.replaceAll(html, '¤DESCRIPTION¤', obj.description);
				html = dnd.replaceAll(html, '¤DESCRIPTIONHTML¤', obj.description_html);
				html = dnd.replaceAll(html, '¤SHORTDESCRIPTION¤', obj.short_description);
				html = dnd.replaceAll(html, '¤SHORTDESCRIPTIONHTML¤', obj.short_description_html);

				html = dnd.replaceAll(html, '¤CLASSFEATURES¤', obj.class_features);
				html = dnd.replaceAll(html, '¤CLASSFEATURESHTML¤', obj.class_features_html);
				html = dnd.replaceAll(html, '¤ADVANCEMENT¤', obj.advancement);
				html = dnd.replaceAll(html, '¤ADVANCEMENTHTML¤', obj.advancement_html);
				html = dnd.replaceAll(html, '¤PRESTIGE¤', isPrestige);

				html = dnd.replaceAll(html, '¤BENEFIT¤', obj.benefit);
				html = dnd.replaceAll(html, '¤SPECIAL¤', obj.special != "" && obj.special != null ? "<h4>Special</h4><p>" + obj.special + "</p>" : "");
				html = dnd.replaceAll(html, '¤NORMAL¤', obj.normal != "" && obj.normal != null ? "<h4>Normal</h4><p>" + obj.normal + "</p>" : "");

				html = dnd.replaceAll(html, '¤ABILITY¤', obj.base_skill != "" && obj.base_skill != null ? obj.base_skill.toLowerCase() : "");

				html = dnd.replaceAll(html, '¤SPELLSCHOOL¤', obj.spellschool_name);
				html = dnd.replaceAll(html, '¤COMPONENTVERBAL¤', isComponentVerbal);
				html = dnd.replaceAll(html, '¤COMPONENTSOMATIC¤', isComponentSomatic);
				html = dnd.replaceAll(html, '¤COMPONENTARCANE¤', isComponentArcane);
				html = dnd.replaceAll(html, '¤COMPONENTDIVINE¤', isComponentDivine);
				html = dnd.replaceAll(html, '¤COMPONENTXP¤', isComponentXP);
				html = dnd.replaceAll(html, '¤MINRANKS¤', obj.min_rank);
				html = dnd.replaceAll(html, '¤TRAINED¤', isTrainedOnly);
				html = dnd.replaceAll(html, '¤PENALTY¤', hasCheckPenalty);

				html = dnd.replaceAll(html, '¤EDITION¤', obj.edition_name);
				html = dnd.replaceAll(html, '¤EDITIONALIAS¤', obj.edition_slug);
				html = dnd.replaceAll(html, '¤EDITIONURL¤', '/edition/' + obj.edition_slug);
				html = dnd.replaceAll(html, '¤BOOK¤', obj.rulebook_name);
				html = dnd.replaceAll(html, '¤BOOKALIAS¤', obj.rulebook_slug);
				html = dnd.replaceAll(html, '¤BOOKURL¤', '/rulebook/' + obj.rulebook_slug);
				html = dnd.replaceAll(html, '¤BOOKPAGE¤', obj.page != null ? " (p. " + obj.page + ")" : "");

				html = dnd.replaceAll(html, '¤CURRENTURL¤', '/' + item.getAttribute("data-item") + '/' + obj.slug);


				itemHtml += html;
				counter++;
			}
		});
		item.innerHTML = itemHtml;
	}
	var templateInit = function(item, data){
		var template = document.getElementById(item.classList[1].replace("-js-",""));
		if(item && data && template){
			dnd.filters();
			templateLoad(item, data, template);
			item.setAttribute("data-loaded", "true");
		}
	}
	dnd.template = function(item, output){
		var data = output,
			hash = window.location.hash.substring(1);
		if(hash != "" && hash != null){
			data = dnd.filter(data);
		}
		templateInit(item, data);
		dnd.loader(false);
	}
	dnd.templates = function(item){
		var items = [],
			templateBaseClass = "-js-template";

		if(item != null){
			templateBaseClass += "--" + item;
		}

		items = document.getElementsByClassName(templateBaseClass);

		if(items.length > 0){
			dnd.loader(true);
			var count = 0;
			for(var i = 0; i < items.length; i++){
				if(items[i].getAttribute("data-endpoint") != null && items[i].getAttribute("data-endpoint") != ""){
					dnd.data(dnd.template, items[i]);
					count++;
				} else if(items[i].getAttribute("data-endpoint") != null && items[i].getAttribute("data-endpoint") != ""){
					count++;
			  	}
			}
			if(count == 0){
				dnd.loader(false);
			}
		} else {
			dnd.loader(false);
		}
	}
})();