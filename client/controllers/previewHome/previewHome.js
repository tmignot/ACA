Template.previewHome.onRendered(function(){
	$('#home-wrapper').css('background-color', this.data.bgColor);
	var img = $('#home_logo')[0];
	img.src = this.data.logoUrl;
	$('body').css('background-color', '#D9EDF7');
});

Template.previewHome.events({
	'click #preview-home-cancel': function(){
		Router.go('Editor');
	},
	'click #preview-home-save': function(e, t){
		console.log(UI.getData());
		// Router.go('Editor');
	}
});

Template.previewHome.onDestroyed(function(){
	$('body').css('background-color', '#ffffff');
});
