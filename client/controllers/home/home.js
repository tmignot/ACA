Template.Home.onRendered(function(){
	$('#home-wrapper').css('background-color', this.data.bgColor);
	var img = $('#home_logo')[0];
	img.src = this.data.logoUrl;
});
