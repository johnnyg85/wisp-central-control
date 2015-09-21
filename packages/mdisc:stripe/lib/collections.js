MdStripeMeteor = {};
MdStripeMeteor.plans = new Mongo.Collection('md_stripemeteor_plans');
MdStripeMeteor.customers = new Mongo.Collection('md_stripemeteor_customers');

if (Meteor.isServer) {
    MdStripeMeteor.webhooks = new Mongo.Collection('md_stripemeteor_webhooks');
}
