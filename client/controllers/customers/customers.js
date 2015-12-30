Template.Customers.onCreated(function(){
	this.searchList = new ReactiveVar([]);
	Template.instance().searchList.set(Customers.find({}));
});

Template.Customers.helpers({
	searchList: function(){
		return Template.instance().searchList.get();
	}
});

Template.Customers.events({
	'keyup #search': function(e, t){
		if ($(e.target).val() != '') {
			query = new RegExp($(e.target).val(), 'i');
			list = Customers.find({ name: query }).fetch();
		} else {
			list = Customers.find({});
		}
		t.searchList.set(list);
	}
});
