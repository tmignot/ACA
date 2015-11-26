Template.searchBar.onRendered(function(){
	$("#transaction-type").multiselect(
		{
			includeSelectAllOption: true,
			selectAllText: "Toutes",
			selectAllNumber: false,
			allSelectedText: "Toutes",
			nonSelectedText: "Nature de la transaction",
			buttonContainer: "<div class='btn-group first-select' role='group' />",
			buttonWidth: "200px"
		}
	);
	$("#property-type").multiselect(
		{
			includeSelectAllOption: true,
			selectAllText: "Tous",
			selectAllNumber: false,
			allSelectedText: "Tous",
			nonSelectedText: "Type de bien",
			buttonContainer: "<div class='btn-group' role='group' />",
			buttonWidth: "200px"
		}
	);
});
