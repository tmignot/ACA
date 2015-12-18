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
		console.log(this.params.collection);
		if (this.params.collection == undefined) {
			this.redirect('/admin/dashboard');
		} else if (this.params.collection == 'agents') {
			if (Roles.userIsInRole(Meteor.user(), ['get','list','insert', 'update', 'remove'], 'Agents') == false) {
				// pause();
				console.log("redirect");
				this.redirect('/admin/dashboard');
			}
		} else  {
			this.render(s(this.params.collection).capitalize().value());
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
	onBeforeAction: function() {
		Session.set('mergingUserOk', undefined);
		if (!Meteor.user()) {
			this.redirect('/');
		} else {
			this.next();
		}
	},
	data: function() {
		if (this.ready()) {
			var agent = Agents.findOne({'services.password.reset.token': this.params.token});
			Meteor.call('mergeUser', agent, function(e,r) {
				Session.set('mergingUserOk', r);
			});
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
