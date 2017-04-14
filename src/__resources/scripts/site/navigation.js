var dnd = dnd || {};
(function() {
	"use strict";

    dnd.navigation = function(){
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
    
})();