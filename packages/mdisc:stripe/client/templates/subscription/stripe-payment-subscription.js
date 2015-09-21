Template.stripePaymentSubscription.helpers({
    stripecustomer: function () {
        return MdStripeMeteor.customers.findOne({userId: Meteor.userId()});
    },
    formatAmount: function (amount) {
        return "$" + (amount / 100);
    },
    formatDate: function (timestamp) {
        var d = new Date(timestamp*1000);
        return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    },
    isCanceled: function (status) {
        return status==='canceled';
    }
});

Template.stripePaymentSubscription.events({
    'click .cancel-btn': function(e) {
        Meteor.call('cancelSubscription', this.customer, this.id, function (err, res) {
            if (err) {
                alert('Failed to cancel your subscription.');
                console.log(err.reason);
            } else {
                alert('Subscription has been cancelled.');
            }
        });
    }
});