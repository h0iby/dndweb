var dnd = dnd || {};
(function(){
	"use strict";
	dnd.vars = dnd.vars || {};
	dnd.service = dnd.service || {};
	var loadData = function(hasLocalStorage){
		$.ajax({
			dataType: "json",
			url: "http://138.68.114.21/endpoints",
			success: function(endpoints){
				dnd.service.endpoints = endpoints;
				dnd.vars.endpointAmount = 1;
				if(hasLocalStorage){
					localStorage.setItem("endpoints", JSON.stringify(endpoints));
				}
				$.each(dnd.service.endpoints, function(id, endpoint){
					if(!endpoint.guid || endpoint.guid == null){
						dnd.vars.endpointAmount = dnd.vars.endpointAmount + 1;
						$.ajax({
							dataType: "json",
							url: "http://138.68.114.21/" + endpoint.path,
							success: function(data){
								dnd.service["" + endpoint.alias + ""] = data;
								if(hasLocalStorage){
									localStorage.setItem(endpoint.alias, JSON.stringify(data));
								}
							}
						});
					}
				});
			}
		});
	}
	var service = function(){
		if(dnd.vars.localStorage && localStorage.length == 0){
			loadData(true);
		} else if (dnd.vars.localStorage){
			dnd.vars.endpointAmount = 1;
			$.each(JSON.parse(localStorage.getItem("endpoints")), function(id, endpoint){
				if(!endpoint.guid || endpoint.guid == null){
					dnd.vars.endpointAmount = dnd.vars.endpointAmount + 1;
					var localItem = localStorage.getItem(endpoint.alias);
					dnd.service["" + endpoint.alias + ""] = JSON.parse(localItem);
				}
			});
		} else {
			loadData(false);
		}
		var counter = 0;
		var interval = setInterval(function(){
			counter = counter + 10;
			var intervalClear = true;
			if (dnd.vars.localStorage){
				if(dnd.vars.endpointAmount == localStorage.length){
					clearInterval(interval);
					dnd.vars.serviceLoaded = true;
					if(counter < 1000){
						dnd.vars.serviceLoadedSpeed = counter + "ms";
					} else {
						dnd.vars.serviceLoadedSpeed = parseFloat(counter/1000) + "s";
					}
				}
			} else {
				if(dnd.service.endpoints != undefined){
					$.each(dnd.service.endpoints, function(id, endpoint){
						if(!endpoint.guid || endpoint.guid == null){
							if(dnd.service["" + endpoint.alias + ""] == undefined){
								intervalClear = false;
							}
						}
					});
				} else {
					intervalClear = false;
				}
				if(intervalClear){
					clearInterval(interval);
					dnd.vars.serviceLoaded = true;
					if(counter < 1000){
						dnd.vars.serviceLoadedSpeed = counter + "ms";
					} else {
						dnd.vars.serviceLoadedSpeed = parseFloat(counter/1000) + "s";
					}
				}
			}



		}, 1);
	}
	dnd.initService = function(){
		dnd.vars.serviceLoaded = false;
		dnd.vars.serviceLoadedSpeed = "-1";
		if(dnd.loadData != undefined && dnd.loadData != ""){
			$("#Loader").show();

			if(dnd.loadData == "service"){
				service();

				var interval = setInterval(function(){
					if(dnd.vars.serviceLoaded){
						clearInterval(interval);
						console.log("json loaded in", dnd.vars.serviceLoadedSpeed);
						dnd.dataLoaded();
						$("#Loader").addClass("loaded");
					}
				}, 100);
			}
		} else {
			$("#Loader").hide();
		}

	}
})();