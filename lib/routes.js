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
