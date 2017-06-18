var dnd = dnd || {};
(function() {
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};
	var templateLoader = function(mode){
		var loader = dnd.selector("#Loader");
		if(mode){
			loader.style.display = 'block';
			loader.classList.remove("is-hidden");
		} else {
			loader.style.display = 'none';
			loader.classList.add("is-hidden");
		}
	}
	var templateClear = function(item){
		item.innerHTML = "";
	}
	var templateLoad = function(item, data, template){
		var templateHtml = template.innerHTML,
			counter = 0,
            itemHtml = "";

		templateClear(item);
		data.forEach(function(obj, i){
			if(counter < dnd.filters.amount){
				var html = templateHtml;

				var isPrestige = obj.prestige == 1 ? true : false;
				var isComponentVerbal = obj.verbal_component == 1 ? true : false;
				var isComponentSomatic = obj.somatic_component == 1 ? true : false;
				var isComponentArcane = obj.arcane_focus_component == 1 ? true : false;
				var isComponentDivine = obj.divine_focus_component == 1 ? true : false;
				var isComponentXP = obj.xp_component == 1 ? true : false;

				html = dnd.replaceAll(html, '#ID#', obj.itemid);
				html = dnd.replaceAll(html, '#NAME#', obj.name);
				html = dnd.replaceAll(html, '#ALIAS#', obj.slug);
				html = dnd.replaceAll(html, '#DESCRIPTION#', obj.description);
				html = dnd.replaceAll(html, '#PRESTIGE#', isPrestige);
				html = dnd.replaceAll(html, '#SPELLSCHOOL#', obj.spellschool_name);
				html = dnd.replaceAll(html, '#COMPONENTVERBAL#', isComponentVerbal);
				html = dnd.replaceAll(html, '#COMPONENTSOMATIC#', isComponentSomatic);
				html = dnd.replaceAll(html, '#COMPONENTARCANE#', isComponentArcane);
				html = dnd.replaceAll(html, '#COMPONENTDIVINE#', isComponentDivine);
				html = dnd.replaceAll(html, '#COMPONENTXP#', isComponentXP);
				html = dnd.replaceAll(html, '#BOOK#', obj.rulebook_name);
				html = dnd.replaceAll(html, '#EDITION#', obj.edition_name);

				html = dnd.replaceAll(html, '#EDITIONURL#', '/edition/' + obj.edition_slug);
				html = dnd.replaceAll(html, '#CURRENTURL#', '/' + item.getAttribute("data-item") + '/' + obj.slug);
				html = dnd.replaceAll(html, '#URL#', '/rulebook/' + obj.rulebook_slug);
				html = dnd.replaceAll(html, '#BOOKURL#', '/rulebook/' + obj.rulebook_slug);

				itemHtml += html;
				counter++;
			}
		});
		item.innerHTML = itemHtml;
	}
	var templateInit = function(item, data){
		var template = document.getElementById(item.classList[1].replace("-js-",""));
		if(item && data && template){
			templateLoad(item, data, template);
		}
	}
	dnd.templates = function(item){
		dnd.filters();
		var items = [],
			templateBaseClass = "-js-template";
		if(item != null){
			templateBaseClass += "--" + item.getAttribute("data-item")
			items = document.getElementsByClassName(templateBaseClass);
		} else {
			items = document.getElementsByClassName(templateBaseClass);
		}
		if(items.length > 0){
			for(var i = 0; i < items.length; i++){
				if(item != null){
					dnd.template(items[i], dnd.service[item.getAttribute("data-type")]);
				} else {
					dnd.data(items[i], dnd.template);
				}
			}
		} else {
			templateLoader(false);
		}
	}
	dnd.template = function(item, output){
		var data = output,
			hash = window.location.hash.substring(1);
		if(hash != "" && hash != null){
			data = dnd.filter(data);
		}
		templateInit(item, data);
		templateLoader(false);
	}
})();