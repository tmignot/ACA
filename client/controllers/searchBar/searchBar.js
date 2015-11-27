Template.searchBar.onRendered(function(){
	$("#transaction-type").multiselect(
		{
			includeSelectAllOption: true,
			selectAllText: "Toutes",
			selectAllNumber: false,
			allSelectedText: "Toutes",
			nonSelectedText: "Transactions",
			buttonContainer: "<div class='btn-group first-select' role='group' />",
			buttonWidth: "150px"
		}
	);
	$("#property-type").multiselect(
		{
			includeSelectAllOption: true,
			selectAllText: "Tous",
			selectAllNumber: false,
			allSelectedText: "Tous",
			nonSelectedText: "Biens",
			buttonContainer: "<div class='btn-group' role='group' />",
			buttonWidth: "100px"
		}
	);
});
