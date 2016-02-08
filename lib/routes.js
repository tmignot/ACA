ApplicationController = RouteController.extend({
	layoutTemplate: 'Layout',
	loadingTemplate: '',
	notFoundTemplate: 'notFound',
	progressTick: false,
	progressDelay: 100,
	progress: true,
	progressSpinner : false
});

Router.configure({
	controller: ApplicationController
});

Router.route('Home', {
	path: '/',
    waitOn: function(){
        return [
					Meteor.subscribe('home_page'),
					Meteor.subscribe('images')
				]
    },
    data: function(){
        if (this.ready()) {
          return HomePage.findOne();    
        }
    },
		onBeforeAction: function() {
			var q = this.params.query;
			if (q.search) {
				Session.set('searched', true);
				Session.set('showResults', true);
				if (q.page)
					Pages.sess('currentPage', parseInt(q.page));
				else
					Pages.sess('currentPage', 1);
				if (q.filters) {
					try {
						var f = JSON.parse(decodeURIComponent(q.filters));
						if (f.description)
							f.description = new RegExp('.*'+f.description+'.*', 'i');
						Pages.set('filters', f);
						var sessionFilters = [];
						_.each(['address.city', 'address.zipcode', 'transactionType', 'propertyType'], function(k) {
							if (f[k]) {
								if (typeof f[k] == 'string')
									sessionFilters.push({key: k, value: f[k]});
								else if (f[k]['$in'])
									_.each(f[k]['$in'], function(c) { sessionFilters.push({key: k, value: c}) });
							}
						});

						console.log(sessionFilters);
						Session.set('filters', sessionFilters);
					} catch (e) {
						console.log(e);
						Session.set('filters', []);
					}
				}
				if (q._id) {
				}
			} else {
				Session.set('filters', []);
				Session.set('showResults', false);
			}
			this.next();
		},
		onAfterAction: function() {
			if (this.params.query.search && $('.results').length) {
				$('html, body').animate({
						scrollTop:$('.results').offset().top
				}, 400);
			}
			else {
				$('html, body').animate({
						scrollTop:$('body').offset().top
				}, 400);
			}
		}
});


Router.route('dashboard', {
	path: '/admin/dashboard',
	loadingTemplate: 'loading',
	layoutTemplate: 'layoutDashboard',
	onBeforeAction: function() {
		if (Meteor.userId()) {
			this.next();
		} else {
			this.render('Admin');
		}
	},
  waitOn: function(){
    return [
			Meteor.subscribe('home_page'),
			Meteor.subscribe('fullUser')
		]
  },
  data: function(){
    if (this.ready()) {
      return HomePage.findOne();    
    }
  }
});

_.each(['agent','customer','estimation','propertie','editor'], function(path) {
	Router.route(path, {
		path: '/admin/'+path+'s(/edit)?/:id?',
		loadingTemplate: 'loading',
		layoutTemplate: 'layoutDashboard',
		onBeforeAction: function() {
			if (Meteor.userId()) {
				var collection = s(path+'s').capitalize().value();
				if (this.params.id) {
					if (Roles.userIsInRole(Meteor.userId(), ['get'], collection)) {
						this.next();
						return;
					} else
						this.redirect('/admin/'+collection);
				} else {
					if (Roles.userIsInRole(Meteor.userId(), ['list'], collection)) {
						this.next();
						return;
					} else
						this.redirect('/admin/dashboard');
				}
			} else
				this.render('Admin');
		},
		waitOn: function() {
			if (this.params.id && this.params.id == 'add')
				return [];
			else if (this.params.id) {
				return [
					Meteor.subscribe(path, this.params.id),
					Meteor.subscribe('images')
				]
			}
			return [
				Meteor.subscribe(path+'s'),
				Meteor.subscribe('images'),
				Meteor.subscribe('fullUser')
			]
		},
		data: function() {
			if (this.params.id && this.params.id === 'add')
				return;
			else if (this.params.id)
				return Meteor.Collections[path+'s'].findOne({_id: this.params.id});
		},	 
		action: function() {
			if (this.params.id && this.params.id === 'add')
				this.render('add'+s(path).capitalize().value());
			else if (this.params.id) {
				if (this.params[0] == '/edit')
					this.render('edit'+s(path).capitalize().value());
				else
					this.render(s(path).capitalize().value());
			}	else
				this.render(s(path+'s').capitalize().value());
		}
	});
});

Router.route('enroll-callback', {
	path: '/enroll-callback/:token',
	layoutTemplate: 'layoutDashboard',
  template: 'Enroll',
	waitOn: function() {
		return Meteor.subscribe('enrolledUser', this.params.token);
	},
	data: function() {
		if (this.ready()) {
			var agent = Agents.findOne({'services.password.reset.token': this.params.token});
			return {
				enrollState: 'finish',
				enrolledUser: agent
			}
		}
	}
});

Router.route('enroll', {
	path: '/enroll-account/:token',
  template: 'Enroll',
  onBeforeAction: function() {
		var	next = this.next;
    Meteor.logout(function() {
			next();
		});
  },
	waitOn: function() {
		return Meteor.subscribe('enrolledUser', this.params.token);
	},		
  data: function() {
    if(this.ready()){
      return {
				enrollState: 'start',
        enrolledUser: Meteor.users.findOne()
      }
   }
  }
});
