var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};

	var templateScroll = function(){
		window.scroll(0,dnd.vars.scollPos);
	}

	var templateClear = function(item){
		item.innerHTML = "";
	}
	var templateLoad = function(item, data, template){
		if(item.getAttribute("data-reset") == "true"){
			templateClear(item);
		}
		var isList = document.getElementsByClassName("-js-amount-sorting").length > 0,
			isRestricted = item.getAttribute("data-output") != null,
			hasPaging = dnd.getHash("page") != "";

		var templateHtml = template.innerHTML,
			counter = 0,
            itemHtml = "",
			filters = dnd.filters.amount != null ? dnd.filters.amount : 25,
			lists = isList ? filters : 999999,
			dataOutput = isRestricted ? Math.floor(item.getAttribute("data-output")) : lists,
			count = isList && !isRestricted && hasPaging ? Math.floor(dataOutput) * Math.floor(dnd.getHash("page")) : Math.floor(dataOutput);

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
				html = dnd.replaceAll(html, '¤CLASSFEATURESHTML¤', obj.class_features_html != "" && obj.class_features_html != null ? '<h3>Features</h3>' + obj.class_features_html : "");
				html = dnd.replaceAll(html, '¤ADVANCEMENT¤', obj.advancement);
				html = dnd.replaceAll(html, '¤ADVANCEMENTHTML¤', obj.advancement_html != "" && obj.advancement_html != null ? '<h3>Advancement</h3>' + obj.advancement_html : "");
				html = dnd.replaceAll(html, '¤PRESTIGE¤', isPrestige);

				html = dnd.replaceAll(html, '¤BENEFIT¤', obj.benefit);
				html = dnd.replaceAll(html, '¤SPECIAL¤', obj.special != "" && obj.special != null ? "<h4>Special</h4><p>" + obj.special + "</p>" : "");
				html = dnd.replaceAll(html, '¤NORMAL¤', obj.normal != "" && obj.normal != null ? "<h4>Normal</h4><p>" + obj.normal + "</p>" : "");

				html = dnd.replaceAll(html, '¤ABILITY¤', obj.base_skill != "" && obj.base_skill != null ? obj.base_skill.toLowerCase() : "");
				html = dnd.replaceAll(html, '¤CHECKHTML¤', obj.check_html != "" && obj.check_html != null ? '<h3>Check</h3>' + obj.check_html : "");
				html = dnd.replaceAll(html, '¤SYNERGYHTML¤', obj.synergy_html != "" && obj.synergy_html != null ? '<h3>Synergy</h3>' + obj.synergy_html : "");
				html = dnd.replaceAll(html, '¤ACTIONHTML¤', obj.action_html != "" && obj.action_html != null ? '<h3>Action</h3>' + obj.action_html : "");
				html = dnd.replaceAll(html, '¤TRYAGAINHTML¤', obj.try_again_html != "" && obj.try_again_html != null ? '<h3>Try again</h3>' + obj.try_again_html : "");
				html = dnd.replaceAll(html, '¤SPECIALHTML¤', obj.special_html != "" && obj.special_html != null ? '<h3>Special</h3>' + obj.special_html : "");
				html = dnd.replaceAll(html, '¤UNTRAINEDHTML¤', obj.untrained_html != "" && obj.untrained_html != null ? '<h3>Untrained</h3>' + obj.untrained_html : "");

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

		if(isList && item.classList.contains("-js-list")){
			templateScroll();
		}
	}
	var templateInit = function(item, data){
		var template = document.getElementById(item.classList[1].replace("-js-",""));
		if(item && data && template){
			dnd.filters(data.length);
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