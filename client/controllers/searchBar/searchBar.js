Template.searchBar.onCreated(function() {
	this.results = new ReactiveVar([]);
});

Template.searchBar.helpers({
	parentData: function() {
		return Template.parentData(1);
	},
	results: function() {
		return Template.instance().results.get();
	}
});

Template.searchBar.events({
	'click button': function(e,t) {
		console.log("coucou");
	},
	'onchange .query-input': function(e,t) {
		console.log($(e.target).val());
	}
});

Template.searchBar.onRendered(function(){
$("button.col-xs-1.btn-danger").css("background", Template.parentData(1).mainColor);
$("button.col-xs-1.btn-danger").css("border-color", Template.parentData(1).mainColor);
	$("#transaction-type").multiselect(
		{
			enableClickableOptGroups: true,
			allSelectedText: "Toutes",
			nonSelectedText: "Options",
			buttonContainer: "<div class='button-container btn-group col-xs-3 col-md-2 first-select' role='group' />",
			buttonClass: "col-xs-12 btn btn-default"
		}
	);
});
