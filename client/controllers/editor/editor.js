Template.Editor.events({
	'click #form-admin-submit-g': function(e, t){
		e.preventDefault();
		var bg = $('#form-g-admin-bg').val();
		var logo = $('#form-g-admin-logo').val();

		var t = HomePage.findOne();

		HomePage.update({_id: t._id}, {$set: {color: bg, url: logo}});
		Router.go()
	},
	'click #preview-admin-submit-g': function(e, t){
		e.preventDefault();

		var homePage = HomePage.findOne();

		var preview = {
			bgColor: $('#form-g-admin-bg-color').val() != "" ? $('#form-g-admin-bg-color').val() : homePage.bgColor,
			mainColor: $('#form-g-admin-main-color').val() != "" ? $('#form-g-admin-main-color').val() : homePage.mainColor,
			logoUrl: $('#form-g-admin-logo-url').val() != "" ? $('#form-g-admin-logo').val() : homePage.logoUrl
		};

		Session.set("preview", preview);
		Router.go('previewHome');
	},
});
