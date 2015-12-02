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


Router.route('Admin',{
    path: '/admin',
    onBeforeAction: function(){
      if (Meteor.userId()){
        Router.go('Dashboard');
      } else {
        this.next();
      }
    }
});

AdminController = ApplicationController.extend({
	onBeforeAction: function() {
		console.log("admin only");
		if (Meteor.userId()) {
			this.next();
		} else {
			Router.go('Admin');
		}
	}
});

Router.route('Dashboard', {
	path: '/admin/:collection?',
	layoutTemplate: 'layoutDashboard',
	onBeforeAction: function() {
		console.log("admin only");
		if (Meteor.userId()) {
			this.next();
		} else {
			Router.go('Admin');
		}
	},
	action: function() {
		console.log(this.params);
		this.render(s(this.params.collection).capitalize().value());
	}
});
