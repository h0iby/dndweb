var dnd = dnd || {};
(function() {
	"use strict";
	var filters = function(){
		var hash = window.location.hash.substring(1);
		var filterToggle = document.getElementsByClassName("filter__toggle");

		if(filterToggle){
			for(var i = 0; i < filterToggle.length; i++){
				if(dnd.vars.modern){
					filterToggle[i].addEventListener('change',function(){
						localStorage.setItem('filterIsShown', this.checked.toString());
					});
				}

				if((hash != "" && hash != null) || (localStorage.getItem('filterIsShown') == "true")){
					if((hash.indexOf("filter=no") > -1)){
						filterToggle[i].checked = false;
					} else{
						filterToggle[i].checked = true;
					}
				}
			}
		}
	}
	var topNav = function(){
		var scrollPos = 0;
        var resizeTimer;
        var header = document.getElementById("Header");
        var headerHeight = header.offsetHeight + 5;

		window.addEventListener('scroll', function(){
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function () {
				if(window.pageYOffset < scrollPos){
					header.classList.remove("is-hidden");
				} else {
					if(!document.getElementById("navigationOn").checked){
						header.classList.add("is-hidden");
					}
				}
				scrollPos = window.pageYOffset;
				dnd.vars.scollPos = Math.floor(scrollPos);
				localStorage.setItem("scrollPos", Math.floor(scrollPos));
			}, 100);
		});
	}
	dnd.loader = function(mode){
		var loader = dnd.selector("#Loader");
		if(mode){
			loader.classList.remove("is-hidden");
		} else {
			loader.classList.add("is-hidden");
		}
	}
    dnd.navigation = function(){
		topNav();
		filters();
    }
})();