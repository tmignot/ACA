Agents = new Mongo.Collection("Agents");

AgentSchema = new SimpleSchema({
    name: {
        type: String,
        min: 2,
        max: 20
    },
    fname: {
        type: String,
        min: 2,
        max: 20
    },
    email: {
        type: String
    }
});

Agents.attachSchema(AgentSchema);

if (Meteor.isServer) {
    Meteor.publish('agents', function(){
        return Agents.find();
    });

    Meteor.startup(function(){
    /*
        Randomize creation of Agents
    */
    });
}

Agents.allow({
	insert: function(doc) { return true; },
	update: function(doc, id) { return true; },
	remove: function(id) { return false; }
});

Agents.deny({
	insert: function() { return false; },
	update: function() { return false; },
	remove: function() { return true; }
});
