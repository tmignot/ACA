updateSlick = function(container) {
	if (!imgs.length)
		return;
	console.log('slicking');
	if (!container) {
		$('#carousel').unslick();
		$('#carousel').slick({
			dots: true,
			centerMode: true,
			slidesToShow: 1,
			adaptiveHeight: true,
			centerMode: true
		});
	} else {
		$(' .carousel[data-carousel-id="'+container+'"]').unslick();
		$(' .carousel[data-carousel-id="'+container+'"]').slick({
		});
	}
};

imgs = [];
loaded = function(img) {
	if (imgs.indexOf(img.src) < 0) {
		imgs.push(img.src);
		if (imgs.length > 1) {
			console.log(imgs);
			updateSlick($(img).data('carousel-id'));
		}
	}
};

Template.carousel.onCreated(function() {
	imgs = [];
});

Template.carousel.onDestroyed(function() {
	imgs = [];
	updateSlick(Template.parentData()._id);
});

Template.carousel.onRendered(function() {
	//updateSlick(Template.parentData()._id);
});

Template.carouselImage.helpers({
	carousel_id: function() {
		return Template.parentData(2)._id;
	}
});
