updateSlick = function() {
	$('#carousel').unslick();
	$('#carousel').slick({
		dots: true,
		centerMode: true,
		slidesToShow: 1,
		adaptiveHeight: true,
		centerMode: true
	});
	console.log('slick');
};

imgs = [];
loaded = function(img) {
	if (imgs.indexOf(img.src) < 0) {
		imgs.push(img.src);
		updateSlick();
	}
};

Template.carousel.onCreated(function() {
	imgs = [];
});

Template.carouselImage.onDestroyed(function() {
	imgs = [];
	updateSlick();
});
