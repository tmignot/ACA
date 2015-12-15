TransitionsHooks = {
	transitioning: false,
	insertElement: function(node, next) {
		var finish, insert;
		insert = (function(_this) {
			return function() {
				this.transitioning = false;
				$(node).addClass('fadeIn');
				$(node).insertBefore(next);
				setTimeout(finish, 500);
			}
		})(this);
		finish = function() {
			$(node).removeClass('fadeIn');
		};
		if (this.transitioning) {
			Meteor.setTimeout(insert, 500);
		} else {
			insert();
		}
	},
	removeElement: function(node) {
		var remove;
		remove = (function(_this) {
			return function() {
				_this.transitioning = false;
				$(node).remove();
			};
		})(this);
		this.transitioning = true;
		$(node).addClass('fadeOut');
		setTimeout(remove, 500);
	}
};

Template.Transitions.onRendered(function() {
	this.firstNode.parentNode._uihooks = TransitionsHooks;
});
