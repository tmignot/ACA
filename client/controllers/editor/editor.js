Template.Editor.events({
	'click #form-admin-submit-g': function(e, t){
		e.preventDefault();
		var bg = $('#form-g-admin-bg').val();
		var logo = $('#form-g-admin-logo').val();

		var t = HomePage.findOne();

		HomePage.update({_id: t._id}, {$set: {color: bg, url: logo}});
	}
});