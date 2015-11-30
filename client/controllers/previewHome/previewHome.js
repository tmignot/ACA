Template.previewHome.onRendered(function(){
	var prev = Session.get('preview');

	$('#home-wrapper').css('background-color', prev.bgColor);
	var img = $('#home_logo')[0];
	img.src = prev.logoUrl;
	$('body').css('background-color', '#D9EDF7');
});

Template.previewHome.events({
	'click #preview-home-cancel': function(){
		Router.go('Editor');
	},
	'click #preview-home-save': function(e, t){
		var prev = Session.get('preview');
		var homePage = HomePage.findOne();
		HomePage.update({_id: homePage._id}, {$set: {bgColor: prev.bgColor, mainColor: prev.mainColor, logoUrl: prev.logoUrl}}, function(err, doc){
			if (err)
				console.log("update abort: preview");
			else
				Router.go('Editor')
		});
	}
});

Template.previewHome.onDestroyed(function(){
	$('body').css('background-color', '#ffffff');
});
