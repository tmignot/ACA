Template.searchBar.onCreated(function() {
	this.results = new ReactiveVar([]);

});

Template.searchBar.helpers({
	results: function() {
		return;
	}
});

Template.searchBar.onRendered(function(){
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
