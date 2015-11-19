Template.mdArchiveReview.helpers({
  subscription: function () {
    return MdArchive.subscription.findOne({owner: Meteor.userId()});
  }
});

Template.mdArchiveReview.events({
  'click .submit-order-btn': function (e) {
    e.preventDefault();
    $(e.target).prop('disabled', true);
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
        WtGrowl.fail("Failed to create/update ChargeBee customer.");
        console.log(err.reason);
        $(e.target).prop('disabled', false);
      } else {
        var customerId = res.customerId;
        var cardDetails = {
          number: subscription.payment.card,
          expMonth: subscription.payment.expMonth,
          expYear: subscription.payment.expYear,
          cvv: subscription.payment.cvc
        };
        Meteor.call('cbUpdateCardInfo', customerId, cardDetails, function (err, res) {
          if (err) {
            WtGrowl.fail("Failed to update Card info for the customer.");
            console.log(err.reason);
            $(e.target).prop('disabled', false);
          } else {
            var planId = '';
            if (subscription.subscriptionPlan == 'monthly') {
              planId = 'archive-service-monthly';
            }
            if (subscription.subscriptionPlan == 'annual') {
              planId = 'archive-service-annual';
            }
            Meteor.call('cbCreateSubscription', customerId, planId, function (err, res) {
              if (err) {
                WtGrowl.fail("Failed to create subscription for the customer.");
                console.log(err.reason);
                $(e.target).prop('disabled', false);
              } else {
                WtGrowl.success("Payment Complete - Thank You!");
                Router.go('mdCloudGoogleOrderPlaced');
              }
            });
          }
        });
      }
    });
  }
});