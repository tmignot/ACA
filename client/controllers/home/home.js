Template.Home.onRendered(function(){
	$('body').css('background-color', this.data.color);
	var img = $('#home_logo')[0];
	img.src = this.data.url;
});