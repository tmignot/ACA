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

Router.route('Admin', {
	path: '/admin/:collection?',
	loadingTemplate: 'loading',
	layoutTemplate: 'layoutDashboard',
	onBeforeAction: function() {
		if (Meteor.userId()) {
			this.next();
		} else {
			this.render('Admin');
		}
	},
	waitOn: function() {
		if (this.params.collection) {
			return Meteor.subscribe(this.params.collection);
		}
	},
	action: function() {
		if (this.params.collection == undefined) {
			this.redirect('/admin/dashboard');
		} else  {
			var val = s(this.params.collection).capitalize().value();
			if (val !== 'dashboard' &&
					!Roles.userIsInRole(Meteor.user(), ['list'], val)) {
				this.redirect('/admin/dashboard');
			}
			this.render(val);
		}
		this.next();
	}
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
