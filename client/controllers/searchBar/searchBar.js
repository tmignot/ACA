Template.searchBar.onCreated(function() {
	this.results = new ReactiveVar([]);
	this.resultsl = new ReactiveVar(false);
	var p = Properties.find({}, {fields: {title: 1, description: 1, 'address.zipcode': 1, 'address.city': 1}}).fetch();
	this.zipcodes = _.map(p, function(i) {
			return {
				type: 'Code postal',
				value: i.address.zipcode
			}});
	this.cities = _.map(p, function(i) {
			return {
				type: 'Ville',
				value: i.address.city
			}});
	Session.set('pop', {query:[],filters:_.flatten([this.cities, this.zipcodes])});
});


Template.searchBar.helpers({
	filters: function() {
		return _.filter(Session.get('filters'), function(f) {
			return _.includes(['address.city', 'address.zipcode'], f.key);
		});
	},
	pop: function() {
		var pop = Session.get('pop');;
		return [
			{
				name: 'query',
				valueKey: 'value',
				display: 'value',
				local: function(){ return Session.get('pop').query },
				template: 'pop'
			},
			{
				name: 'filters',
				valueKey: 'value',
				display: 'value',
				local: function(){ return Session.get('pop').filters },
				header: '<small>Ajouter un filtre</small>',
				template: 'pop'
			}
		];
	},
	parentData: function() {
		return Template.parentData(1);
	},
	hlength: function() {
		return Properties.find(Pages.get('filters')).count();
	},
	popOptions: function() {
		return Template.instance().popOptions.get();
	},
	transactionTypes: function() {
		return _.uniq(_.map(Properties.find({},{
				fields: { transactionType: 1}
			}).fetch(), function(p) {
				return p.transactionType;
			}));
	},
	propertyTypes: function() {
		return _.uniq(_.map(Properties.find({},{
				fields: {	propertyType: 1	}
			}).fetch(), function(p) {
				return p.propertyType;
			}));
	},
	property: function() {
		return Properties.findOne({_id: Session.get('propertyID')});
	},
	isChecked: function(type, val) {
		var s = Session.get('filters');
		if (! _.find(s, {key: type}))
			return 'checked';
		return (_.find(s, {key: type, value: val}) ? 'checked' : '');
	}
});

var createFilters = function() {
	filters = {};
	_.each(Session.get('filters'),function(f) {
		if (filters[f.key] && filters[f.key]['$in']) {
			filters[f.key]['$in'].push(f.value);
		} else
			filters[f.key] = {$in: [f.value]};
	});
	$('.dropdown-menu input').each(function(i,j) {
		var key = $(j).data('filter-key'),
				val = $(j).data('filter-val');
		if (filters[key] == undefined)
			filters[key] = {$in: []};
		if ($(j).is(':checked') && !_.includes(filters[key].$in, val))
			filters[key].$in.push(val);
		else if (!$(j).is(':checked') && _.includes(filters[key].$in, val))
			filters[key].$in.splice(filters[key].$in.indexOf(val), 1);
	});
	var budget = $('#budgetInput').val();
	if (budget != '')
		filters.price = {$lt: budget * 1.2};
	if ($('.tt-input').val() != '')
		filters.description = $('.tt-input').val();
	filters.visible = true;
	filters.estimation = false;
	return filters;
};

Template.searchBar.events({
	'click button.btn-danger': function(e,t) {
		$('html, body').animate({
				scrollTop:$('.dummy').offset().top
		}, 400);
		Router.go('Home', {}, {query: 'search=true&page=1&filters='+encodeURIComponent(JSON.stringify(createFilters()))});
	},
	'keyup .query-input': function(e,t) {
		if (e.keyCode == 13) {
			if (Session.get('typeahead') == true)
				Session.set('typeahead', false);
			else
				t.find('.item-bar .btn-danger').click();
		}
	},
	'keyup #budgetInput': function(e,t) {
		if (e.keyCode == 13)
			t.find('.item-bar .btn-danger').click();
	},
	'typeahead:select .typeahead': function(e,t) {
		Session.set('typeahead', true);
		var filters = Session.get('filters');
		var val = e.currentTarget.value;
		if (_.findIndex(t.cities, ['value', val])>=0)
			filters.push({key: 'address.city', value: val});
		else if (_.findIndex(t.zipcodes, ['value', val])>=0)
			filters.push({key: 'address.zipcode', value: val});
		Session.set('filters', _.uniqWith(filters, _.isEqual));
		$('.typeahead').typeahead('val', '');
		$('.query-input').val('');
		$('.query-input').focus();
	},
	'click .dropdown-menu': function(e,t) {
		e.stopPropagation();
	},
	'click .list-group-item-danger i': function(e,t) {
		var filters = Session.get('filters');
		var index = _.findIndex(filters,function(f) {
			return f.key == $(e.currentTarget).data('filterkey')	&&
						 f.value == $(e.currentTarget).data('filtervalue');
		});
		filters.splice(index, 1);
		Session.set('filters', filters);
	},
	'click .property-card .annonce': function(e,t) {
		var query = ['search=true',
								'page='+Pages.sess('currentPage'),
								'_id='+$(e.currentTarget).data('id'),
								'filters='+encodeURIComponent(JSON.stringify(createFilters()))]
		Router.go('Home', {}, {query: _.join(query, '&')});
	}
});

Template.searchBar.onRendered(function(){
	Meteor.typeahead.inject();
});

Template.annonceCard.onRendered(function(){
	$('.results .shadowed.row').css('box-shadow', Template.parentData(3).mainColor + ' 3px 3px 20px -8px');
});

Template.annonceCard.helpers({
	img: function() {
		return Images.find({_id: {$in: Template.instance().data.images||[]}})
	}
});

Template.properties.uihooks({
	'.page-container': {
		insert: function(node, next, tpl) {
			$(node).insertBefore(next);
			$(node).addClass('fadeIn animated');
		},
		move: function(node, next, tpl) {
			console.log('moving', node);
		},
		remove: function(node, tpl) {
			$(node).removeClass('fadeIn');
			$(node).addClass('fadeOut');
			Meteor.setTimeout(function() {
				$(node).remove();
				Session.set('searched', true);
			}, 500);
		}
	}
});

Template.pageNavig.helpers({
	navigationNeighbors: function() {
		return Pages.paginationNeighbors();
	}
});

Template.pageNavig.events({
	'click li:not(.disabled .active) a': function(e,t) {
		var p = Router.current().params;
		p.query.page = $(e.currentTarget).data('to-page');
		Router.go('Home', {}, {query: $.param(p.query)});
		$('html, body').animate({
				scrollTop:$('.results').offset().top
		}, 400);
	}
});
