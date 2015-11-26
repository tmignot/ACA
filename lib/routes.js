Router.configure({
  layoutTemplate: 'Layout',
  notFoundTemplate: 'notFound',
  loadingTemplate: 'Loading',
  progressTick: false,
  progressDelay: 100,
  progress: true,
  progressSpinner : false
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
    path: '/admin'
});

Router.route('Dashboard', {
    path: '/admin/dashboard',
    waitOn: function(){
      return Meteor.subscribe('agency');
    }
});
