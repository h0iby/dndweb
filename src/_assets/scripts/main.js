var app = app || {};

$(function(){
	'use strict';

	app.data();
	app.slider();
});

var app = app || {};



(function(){

	"use strict";



	app.data = function(){





		var Profile = Backbone.Model.extend();

		var ProfileList = Backbone.Collection.extend({

		   model: Profile,

		   url: 'http://138.68.114.21/endpoints'

		});



		var ProfileView = Backbone.View.extend({

			el: "#profiles",

			template: _.template($('#profileTemplate').html()),

			initialize: function(){

				this.listenTo(this.collection,"add", this.renderItem);

			},

			render: function () {

				this.collection.each(function(model){

					 var profileTemplate = this.template(model.toJSON());

					 this.$el.append(profileTemplate);

				}, this);

				return this;

			},

			renderItem: function(profile) {

				 var profileTemplate = this.template(profile.toJSON());

				 this.$el.append(profileTemplate);

			}

		});



		var profiles = new ProfileList();

		profiles.fetch();

		var profilesView = new ProfileView({ collection: profiles });

		profilesView.render();

		console.log(profiles);



		/*

		var addData = [

			{

				"id": "p4",

				"name" : "sdfsdfsdf",

				"title" : "sdfsdf",

				"background" : "sdfsdf"

			},

			{

				"id": "p5",

				"name" : "DDDssssD",

				"title" : "EsssEEE",

				"background" : "ssssFFFF"

			},

			{

				"id": "p6",

				"name" : "GGssdsfGG",

				"title" : "HsdfHHH",

				"background" : "IIaaaaII"

			}

		];

		profileList.add(addData);

		*/



	}

})();
var app = app || {};

(function($){
	"use strict";

	app.slider = function(){
		console.log("slider");
	}
})();