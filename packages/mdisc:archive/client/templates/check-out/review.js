Template.mdArchiveReview.helpers({
  subscription: function () {
    return MdArchive.subscription.findOne({owner: Meteor.userId()});
  }
});

Template.mdArchiveReview.events({
  'click .submit-order-btn': function () {
    var subscription = MdArchive.subscription.findOne({owner: Meteor.userId()});
    var billingAddress = {
      first_name: subscription.shipTo.name,
      line1: subscription.shipTo.address,
      line2: subscription.shipTo.address2,
      city: subscription.shipTo.city,
      state: subscription.shipTo.state,
      zip: subscription.shipTo.zip
    };
    Meteor.call('cbCreateCustomer', subscription.shipTo.name, ' ', billingAddress, function (err, res) {
      if (err) {
        WtGrowl.fail(err.reason);
      } else {
        var customer = res;
        var customerId = res.customerId;
        var cardDetails = {
          number: subscription.payment.card,
          expMonth: subscription.payment.expMonth,
          expYear: subscription.payment.expYear,
          cvv: subscription.payment.cvv
        };
        Meteor.call('cbUpdateCardInfo', customerId, cardDetails, function (err, res) {
          if (err) {
            WtGrowl.fail(err.reason);
          } else {
            var card = res;
            Meteor.call('cbCreateSubscription', customerId, subscription.subscriptionPlan, function (err, res) {
              if (err) {
                WtGrowl.fail(err.reason);
              } else {
                var subscription = res;
                WtGrowl.success("Payment Complete - Thank You!");
              }
            });
          }
        });
      }
    });
  }
});