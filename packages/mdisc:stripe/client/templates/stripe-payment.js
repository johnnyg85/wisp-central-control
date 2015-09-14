Template.mdStripePayment.helpers({
    hasSubscription: function() {
        if (MdStripeMeteor.subscriptions.findOne({userId: Meteor.userId()})) {
            return true;
        }
        return false;
    }
});