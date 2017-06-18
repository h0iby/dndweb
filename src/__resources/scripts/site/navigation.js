var dnd = dnd || {};
(function() {
	"use strict";

	var filters = function(){
		var hash = window.location.hash.substring(1);

		if(hash != "" && hash != null){
			var filterToggle = document.getElementsByClassName("filter__toggle");
			if(filterToggle){
				filterToggle[0].checked = true;
			}
		}
	}
	var topNav = function(){
		var scrollPos = 0;
        var timeout;
        var header = document.getElementById("Header");
        var headerHeight = header.offsetHeight + 5;

        window.onscroll = function() {
            if(window.pageYOffset < scrollPos){
                header.classList.remove("is-hidden");
            } else {
                header.classList.add("is-hidden");
            }

            scrollPos = window.pageYOffset;
        };
	}


    dnd.navigation = function(){
		topNav();
		filters();
    }

})();