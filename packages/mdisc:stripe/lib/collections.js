MdStripeMeteor = {};
MdStripeMeteor.plans = new Mongo.Collection('md_stripe_plans');
MdStripeMeteor.customers = WtCollection('md_stripe_customers');

if (Meteor.isServer) {
    MdStripeMeteor.webhooks = new Mongo.Collection('md_stripe_webhooks');
}
