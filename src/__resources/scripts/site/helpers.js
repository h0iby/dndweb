var dnd = dnd || {};
(function() {
	"use strict";
	dnd.ajax = function(mode, url, successFunction, errorFunction){
		var request = new XMLHttpRequest();
		request.open('GET', url);
		request.onload = function() {
			if(!mode){
				if (request.status >= 200 && request.status < 400) {
					successFunction(request.responseText);
				} else {
					errorFunction();
				}
			}
		};
		request.onloadend = function(){
			if(mode){
				if (request.status >= 200 && request.status < 400) {
					successFunction(request.responseText);
				} else {
					errorFunction();
				}
			}
		}
		request.onerror = function() {
			errorFunction();
		};
		request.send();
	}
	dnd.selector = function(selector, parent){
		selector = selector.trim();
		if (!parent) {
			parent = document;
		}
		if (selector.indexOf(' ') === -1) {
			if (selector.lastIndexOf('.') === 0) {
				return parent.getElementsByClassName(selector.substring(1));
			}
			if (selector.lastIndexOf('#') === 0) {
				return parent.getElementById(selector.substring(1));
			}
		}
		return parent.querySelectorAll(selector);
	}
	dnd.replaceAll = function(string, source, target){
		return string.replace(new RegExp(source, 'g'), target);
	}
	dnd.appendTo = function(target, html){
		target.insertAdjacentHTML('beforeend', html);
	}
	dnd.addEventHandler = function (elem, eventType, handler) {
		if (elem.addEventListener)
			elem.addEventListener (eventType, handler, false);
		else if (elem.attachEvent)
			elem.attachEvent ('on' + eventType, handler);
	}
	dnd.setHash = function(item, value){
		var newItemValue = value != "" ? item + "=" + value.toLowerCase() : "";
		var hash = window.location.hash.substring(1);
		var hashNew = "#" + hash;

		if(history.pushState) {
			if(value != ""){
				if(hash.indexOf(item) < 0){
					if(hashNew.length > 1){
						hashNew += "&";
					}

					hashNew += newItemValue;
				} else {
					if(hash.indexOf("&") < 0){
						hashNew = "#" + newItemValue;
					} else {
						var subStringTemp = hash.substring(hash.indexOf(item));
						var subString = subStringTemp;
						if(subStringTemp.indexOf("&") > -1){
							subString = subStringTemp.substring(0, subStringTemp.indexOf("&"))
						}

						hashNew = hashNew.replace(subString, newItemValue);
					}
				}

				history.pushState(null, null, hashNew);
			}
			else {
				if(hash.indexOf("&") < 0){
					if(hash.indexOf(item) > -1){
						history.pushState(null, null, " ");
					}
				} else {
					var subStringTemp = hash.substring(hash.indexOf(item));
					var subString = subStringTemp;
					if(subStringTemp.indexOf("&") > -1){
						subString = subStringTemp.substring(0, subStringTemp.indexOf("&"))
					}

					hashNew = hashNew.replace("#" + subString + "&", "#");
					hashNew = hashNew.replace("&" + subString, "");

					history.pushState(null, null, hashNew);
				}
			}
		}
	}
	dnd.getHash = function(item){
		if(window.location.hash && item != null){
			var itemValue = "";
			var hashItems = window.location.hash.substring(1).split("&");
			for(var i = 0; i < hashItems.length; i++){
				var hashes = hashItems[i].split("=");
				if(hashes[0] == item){
					itemValue = hashes[1];
				}
			}
			return itemValue;
		} else {
			return window.location.hash;
		}
	}
})();