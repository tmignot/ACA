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
        return Meteor.subscribe('home_page');
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
    return Meteor.subscribe('home_page');
  },
  data: function(){
    if (this.ready()) {
      return HomePage.findOne();    
    }
  }
});

_.each(['agents','customers','estimations','properties','meetings','editor'], function(path) {
	Router.route(path, {
		path: '/admin/'+path+'/:id?',
		loadingTemplate: 'loading',
		layoutTemplate: 'layoutDashboard',
		onBeforeAction: function() {
			if (Meteor.userId()) {
				console.log('logged in');
				var collection = s(path).capitalize().value();
				if (this.params.id) {
					console.log('id given');
					if (Roles.userIsInRole(Meteor.userId(), ['get'], collection)) {
						console.log('access granted: get');
						this.next();
						return;
					} else {
						console.log('access denied: get; redirecting to '+collection);
						this.redirect('/admin/'+collection);
					}
				} else {
					console.log('id not given');
					if (Roles.userIsInRole(Meteor.userId(), ['list'], collection)) {
						console.log('access granted list');
						this.next();
						return;
					} else {
						console.log('access denied list; redirecting to dashbaord');
						this.redirect('/admin/dashboard');
					}
				}
			} else {
				console.log('not logged in');
				this.render('Admin');
			}
		},
		waitOn: function() {
			return Meteor.subscribe(path);
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
