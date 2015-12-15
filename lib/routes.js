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
		}	else {
			this.render(s(this.params.collection).capitalize().value());
		}
	}
});

Router.route('enroll', {
	path: '/enroll-account/:token',
  template: 'Enroll',
  onBeforeAction: function() {
    Meteor.logout();
  },
	waitOn: function() {
		return Meteor.subscribe('enrolledUser', this.params.token);
	},		
  data: function() {
    if(this.ready()){
      return {
        enrolledUser: Meteor.users.findOne()
      }
   }
  }
})

