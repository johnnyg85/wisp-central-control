Template.mdStripePayment.helpers({
    hasSubscription: function() {
        if (MdStripeMeteor.subscriptions.find({userId: Meteor.userId()})) {
            return true;
        }
        return false;
    }
});