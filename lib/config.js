_ = lodash;
this.PropertyClientPages = new Meteor.Pagination(Properties, {
	itemTemplate: 'annonceCard',
	fastRender: true,
	perPage: 3,
	filters: {
		visible: true,
		estimation: false
	},
	availableSettings: {
		filters: function(filters) {
			return filters.visible == true && 
				filters.estimation == false
		}
	}
});

this.PropertyPages = new Meteor.Pagination(Properties, {
	templateName: 'PropertyPages',
	itemTemplate: 'propertyCard',
	fastRender: true,
	perPage: 15,
	filters: {
		estimation: false
	},
	availableSettings: {
		filters: function() {
			return Roles.userIsInRole(Meteor.userId(), 'list', 'Properties')
		}
	}
});

this.EstimationsPages = new Meteor.Pagination(Properties, {
	templateName: 'EstimationsPages',
	itemTemplate: 'estimationCard',
	perPage: 15,
	filters: {
		estimation: true
	},
	availableSettings: {
		filters: function() {
			return Roles.userIsInRole(Meteor.userId(), 'list', 'Estimations')
		}
	}
});

this.AgentsPages = new Meteor.Pagination(Agents, {
	templateName: 'AgentsPages',
	itemTemplate: 'AgentCard',
	fastRender: true,
	perPage: 25,
	availableSettings: {
		filters: function() {
			return Roles.userIsInRole(Meteor.userId(), 'list', 'Agents')
		}
	}
});

this.CustomersPages = new Meteor.Pagination(Customers, {
	templateName: 'CustomersPages',
	itemTemplate: 'CustomerCard',
	fastRender: true,
	perPage: 25,
	availableSettings: {
		filters: function() {
			return Roles.userIsInRole(Meteor.userId(), 'list', 'Customers')
		}
	}
});

if (Meteor.isClient) {
	var cli = this;
	_.each(['PropertyPages','EstimationsPages','AgentsPages','CustomersPages'], function(name) {
		Template[name].helpers({
			noItems: function() { 
				return cli[name].getPage().length == 0;
			}
		});
	});
}
