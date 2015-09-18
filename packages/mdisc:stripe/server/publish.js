Meteor.publish('stripeplans', function() {
    return MdStripeMeteor.plans.find();
});

Meteor.publish('stripecustomers', function() {
    return MdStripeMeteor.customers.find({userId: this.userId});
});