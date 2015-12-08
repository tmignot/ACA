ApplicationController = RouteController.extend({
  layoutTemplate: 'Layout',
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
	layoutTemplate: 'layoutDashboard',
	onBeforeAction: function() {
		if (Meteor.userId()) {
			this.next();
		} else {
			this.render('Admin');
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
