Template.Editor.events({
	'click #form-admin-submit-g': function(e, t){
		e.preventDefault();
		var bg = $('#form-g-admin-bg').val();
		var logo = $('#form-g-admin-logo').val();

		var t = HomePage.findOne();

		HomePage.update({_id: t._id}, {$set: {color: bg, url: logo}});
	},
	'click #preview-admin-submit-g': function(e, t){
		e.preventDefault();
		var opt = {
			bg: $('#form-g-admin-bg').val(),
			logo: $('#form-g-admin-logo').val()
		};

		console.log(opt);
		Router.go('previewHome', opt);
	},
});