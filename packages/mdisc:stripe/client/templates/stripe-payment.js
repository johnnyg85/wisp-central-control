Template.mdStripePayment.helpers({
    stripeCustomer: function() {
        if (MdStripeMeteor.customers.findOne({userId: Meteor.userId()})) {
            return true;
        }
        return false;
    }
});