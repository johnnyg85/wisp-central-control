Template.stripePaymentSubscription.helpers({
    subscriptionslist: function () {
        return MdStripeMeteor.subscriptions.find({userId: Meteor.userId()});
    },
    formatAmount: function (amount) {
        return "$" + (amount / 100);
    },
    formatDate: function(timestamp) {
        var d = new Date(timestamp*1000);
        return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    }
});