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
		$('.carousel[data-carousel-id="'+container+'"]').unslick();
		if (imgs.length > 1) {
			$('.carousel[data-carousel-id="'+container+'"]').slick({
				dots: true,
				centerMode: true,
				slidesToShow: 1,
				adaptiveHeight: true,
				centerMode: true,
				onAfterChange: function(slick, currentSlide) {
					Session.set('currentSlide', currentSlide);
				}
			});
		}
		Session.set('currentSlide', 0);
	}
};

imgs = [];
loaded = function(img) {
	if (imgs.indexOf(img.src) < 0) {
		imgs.push(img.src);
		if (imgs.length > 1) {
			updateSlick($(img).data('carousel-id'));
		}
	}
};

Template.carousel.onCreated(function() {
	Session.set('currentSlide', 0);
	imgs = [];
});

Template.carousel.onDestroyed(function() {
	updateSlick(Template.parentData()._id);
});


Template.carouselImage.helpers({
	carousel_id: function() {
		var d = Template.parentData(2);
		if (d)
			return d._id;
	}
});

Template.carousel.events({
	'click .slick-slide.slick-active': function(e,t) {
		/*
		var i = $(e.currentTarget).find('img')[0];
		console.log(i);
		Modal.show('imageModal', {src: i.src, width: '100%'});
		*/
	},

});
