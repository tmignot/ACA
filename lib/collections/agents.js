AgentSchema = new SimpleSchema({
});

Agents = new Mongo.Collection("Agents");
Agents.attachSchema(AgentSchema);
