Meteor.publish('stripeplans', function() {
    return MdStripeMeteor.plans.find();
});

Meteor.publish('subscriptions', function() {
    return MdStripeMeteor.subscriptions.find({userId: this.userId});
});