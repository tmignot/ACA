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
    path: '/admin',
    onBeforeAction: function(){
      if (Meteor.userId()){
        Router.go('Dashboard');
      } else {
        this.next();
      }
    }
});

Router.route('Dashboard', {
    path: '/admin/dashboard',
    onBeforeAction: function(){
      if (Meteor.userId()){
        this.next();
      } else {
        Router.go('Admin');
      }
    }
});

Router.route('Property', {
    path: '/admin/property',
    onBeforeAction: function(){
      if (Meteor.userId()){
        this.next();
      } else {
        Router.go('Admin');
      }
    }
});

Router.route('Customers', {
    path: '/admin/customers',
    onBeforeAction: function(){
      if (Meteor.userId()){
        this.next();
      } else {
        Router.go('Admin');
      }
    }
});

Router.route('Agency', {
    path: '/admin/agency',
    onBeforeAction: function(){
      if (Meteor.userId()){
        this.next();
      } else {
        Router.go('Admin');
      }
    }
});

Router.route('Editor', {
    path: '/admin/editor',
    onBeforeAction: function(){
      if (Meteor.userId()){
        this.next();
      } else {
        Router.go('Admin');
      }
    },
    waitOn: function(){
      return Meteor.subscribe('home_page');
    }
});

Router.route('previewHome', {
    path: '/admin/editor/preview',
    onBeforeAction: function(){
      if (Meteor.userId()){
        this.next();
      } else {
        Router.go('Admin');
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