Template.addAgent.events({
	'submit form': function(e,t) {
		e.preventDefault();
		Meteor.call('addUser', e.currentTarget.inputUsername.value, function(err){
			if (err)
				console.log(err);
			else
				$('#addAgent').closeModal();
		});
	}
});
