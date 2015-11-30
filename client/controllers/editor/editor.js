Template.Editor.events({
	'click #form-admin-submit-g': function(e, t){
		e.preventDefault();
		
		var homePage = HomePage.findOne();

		var prev = {
			bgColor: $('#form-g-admin-bg-color').val() != "" ? $('#form-g-admin-bg-color').val() : homePage.bgColor,
			mainColor: $('#form-g-admin-main-color').val() != "" ? $('#form-g-admin-main-color').val() : homePage.mainColor,
			logoUrl: $('#form-g-admin-logo-url').val() != "" ? $('#form-g-admin-logo-url').val() : homePage.logoUrl
		};

		HomePage.update({_id: homePage._id}, {$set: {bgColor: prev.bgColor, mainColor: prev.mainColor, logoUrl: prev.logoUrl}}, function(err, doc){
			if (err)
				console.log("update abort: preview");
			else
				Router.go('Editor')
		});
	},
	'click #preview-admin-submit-g': function(e, t){
		e.preventDefault();

		var homePage = HomePage.findOne();

		var preview = {
			bgColor: $('#form-g-admin-bg-color').val() != "" ? $('#form-g-admin-bg-color').val() : homePage.bgColor,
			mainColor: $('#form-g-admin-main-color').val() != "" ? $('#form-g-admin-main-color').val() : homePage.mainColor,
			logoUrl: $('#form-g-admin-logo-url').val() != "" ? $('#form-g-admin-logo-url').val() : homePage.logoUrl
		};

		Session.set("preview", preview);
		Router.go('previewHome');
	},
});
