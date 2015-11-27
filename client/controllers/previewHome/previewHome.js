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
	'click #preview-home-save': function(){
		console.log("on fait des trucs et on retourne sur l'editeur.");
		Router.go('Editor');
	}
});

Template.previewHome.onDestroyed(function(){
	$('body').css('background-color', '#ffffff');
});
