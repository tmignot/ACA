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
	'submit': function(e,t) {
	},
	'onchange .query-input': function(e,t) {
		console.log($(e.target).val());
	}
});

Template.searchBar.onRendered(function(){
	$("button.col-md-1.btn-danger").css("background-color", Template.parentData(1).mainColor);
	$("button.col-md-1.btn-danger").css("border-color", Template.parentData(1).mainColor);
	$("#transaction-type").multiselect(
		{
			includeSelectAllOption: true,
			selectAllText: "Toutes",
			selectAllNumber: false,
			allSelectedText: "Toutes",
			nonSelectedText: "Transactions",
			buttonContainer: "<div class='button-container btn-group col-md-2 first-select' role='group' />",
			buttonClass: "col-md-12 btn btn-default"
		}
	);
	$("#property-type").multiselect(
		{
			includeSelectAllOption: true,
			selectAllText: "Tous",
			selectAllNumber: false,
			allSelectedText: "Tous",
			nonSelectedText: "Biens",
			buttonContainer: "<div class='button-container btn-group col-md-2' role='group' />",
			buttonClass: "col-md-12 btn btn-default"
		}
	);
});
