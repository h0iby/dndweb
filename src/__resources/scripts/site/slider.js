var dnd = dnd || {};
(function() {
	"use strict";
    dnd.vars = dnd.vars || {};

    

    var sliderChange = function(i, slider, sliderItems){
        var slideTo = (100 / sliderItems.length) * Math.floor(i);
        slider.style.transform = "translate(-"+slideTo+"%,0)";
        slider.setAttribute("data-current", i);
    }
    var sliderPrevNextClick = function(mode, container, slider, sliderItems){
        var current = Math.floor(slider.getAttribute("data-current"));
        
        if(mode){
            current++;
        } else {
            current--;
        }

        if(current < 0){
            if(slider.getAttribute("data-stop-end") == "true"){
                current = 0;
            } else {
                current = (sliderItems.length - 1);
            }
        }
        else if(current >= sliderItems.length){
            if(slider.getAttribute("data-stop-end") == "true"){
                current = (sliderItems.length - 1);
            } else {
                current = 0;
            }
        }
        
        container.getElementsByClassName("slider__checkbox")[current].checked = true;
        sliderChange(current, slider, sliderItems);
    }
    var sliderLabels = function(container, slider, sliderItems, number){
        var navNode = document.createElement("nav");
        navNode.classList.add("slider__label-container");

        for(var i = 0; i < sliderItems.length; i++){
            var labelNode = document.createElement("label");
            labelNode.innerHTML = sliderItems[i].getAttribute("data-name");
            labelNode.classList.add("slider__label");
            labelNode.setAttribute("for", "slider"+number+"_" + i);
            
            navNode.appendChild(labelNode);
        }
        container.insertBefore(navNode, slider);
    }
    var sliderPrevNext = function(container, slider, sliderItems){
        var labelPrevNode = document.createElement("label");
        var labelNextNode = document.createElement("label");

        labelPrevNode.classList.add("slider__nav");
        labelPrevNode.classList.add("slider__nav--prev");
        labelNextNode.classList.add("slider__nav");
        labelNextNode.classList.add("slider__nav--next");

        labelPrevNode.innerHTML = "Prev";
        labelNextNode.innerHTML = "Next";

        labelPrevNode.addEventListener("click", function(e){
            e.preventDefault;
            sliderPrevNextClick(false, container, slider, sliderItems);
        });

        labelNextNode.addEventListener("click", function(e){
            e.preventDefault;
            sliderPrevNextClick(true, container, slider, sliderItems);
        });

        container.insertBefore(labelPrevNode, slider);
        container.insertBefore(labelNextNode, slider);
    }
    var sliderInputs = function(container, slider, sliderItems, number){
        var navNode = document.createElement("nav");
        navNode.classList.add("slider__checkbox-container");

        for(var i = 0; i < sliderItems.length; i++){
            var inputNode = document.createElement("input");
            inputNode.classList.add("slider__checkbox");
            inputNode.setAttribute("id", "slider"+number+"_" + i);
            inputNode.setAttribute("name", "slider"+number);
            inputNode.setAttribute("type", "radio");
            inputNode.setAttribute("data-item", i);
            if(i == 0){
                inputNode.setAttribute("checked", "checked")
            }
            inputNode.addEventListener("change", function(){ sliderChange(this.getAttribute("data-item"), slider, sliderItems); });
            navNode.appendChild(inputNode);
        }
        container.insertBefore(navNode, slider);
    }
    var sliderSwipe = function(container, slider, sliderItems){
        var touchsurface = container,
        swipedir,
        startX,
        startY,
        distX,
        distY,
        threshold = 150, //required min distance traveled to be considered swipe
        restraint = 100, // maximum distance allowed at the same time in perpendicular direction
        allowedTime = 2000, // maximum time allowed to travel that distance
        elapsedTime,
        startTime;
      
        touchsurface.addEventListener('touchstart', function(e){
            var touchobj = e.changedTouches[0];
            swipedir = 'none';
            distX = 0;
            distY = 0;
            startX = touchobj.pageX;
            startY = touchobj.pageY;
            startTime = new Date().getTime(); // record time when finger first makes contact with surface
            e.preventDefault();
        }, false)
        touchsurface.addEventListener('touchmove', function(e){
            var touchobj = e.changedTouches[0];
            distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
            distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
            var dist = Math.floor(distX);
            if(distX < 0){ dist = -dist; }
            var distPercentage = Math.floor(((dist / sliderItems[0].offsetWidth) * 100) / sliderItems.length);
            if(distX < 0){ distPercentage = -distPercentage; }
            e.preventDefault();

            var currentPercentage = -Math.floor(slider.getAttribute("data-current")) * (100/sliderItems.length)
            var nextPercentage = currentPercentage + distPercentage;
            slider.style.transition = "none";
            slider.style.transform = "translate("+nextPercentage+"%,0)";
        }, false)
        touchsurface.addEventListener('touchend', function(e){
            var touchobj = e.changedTouches[0];
            distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
            distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
            elapsedTime = new Date().getTime() - startTime; // get time elapsed
            if (elapsedTime <= allowedTime){ // first condition for awipe met
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                    swipedir = (distX < 0)? 'left' : 'right'; // if dist traveled is negative, it indicates left swipe
                }
                else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                    swipedir = (distY < 0)? 'up' : 'down'; // if dist traveled is negative, it indicates up swipe
                }
            }
            slider.style.transition = "";
            if(swipedir == "left"){
                sliderPrevNextClick(true, container, slider, sliderItems);
            }
            else if(swipedir == "right"){
                sliderPrevNextClick(false, container, slider, sliderItems);
            } else {
                sliderChange(slider.getAttribute("data-current"), slider, sliderItems);
            }
            e.preventDefault();
        }, false)
    }
    var sliderSetStyles = function(slider, sliderItems){
        slider.style.transform = "translate(0%,0)";
        slider.style.width = (100 * sliderItems.length) + "%";
        slider.setAttribute("data-current", 0);
        if(sliderItems.length > 0){
            for(var i = 0; i < sliderItems.length; i++){
                var sliderItem = sliderItems[i];
                sliderItem.style.width = (100 / sliderItems.length) + "%";
            }            
        }
    }
    var sliderInit = function(container, number){
        var sliderItems = container.getElementsByClassName("slider__item");
        var slider = container.getElementsByClassName("slider")[0];
        
        sliderSetStyles(slider, sliderItems);
        sliderInputs(container, slider, sliderItems, number);
        sliderPrevNext(container, slider, sliderItems);
        sliderLabels(container, slider, sliderItems, number);
        sliderSwipe(container, slider, sliderItems);
    }
    dnd.sliders = function(){
        var containers = document.getElementsByClassName("-js-slider");
        if(containers.length > 0){
            for(var i = 0; i < containers.length; i++){
                sliderInit(containers[i], i);
            }
        }
    }
})();