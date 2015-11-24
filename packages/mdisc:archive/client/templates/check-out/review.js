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
    var cbCustomer = MdChargeBee.customers.findOne({owner: Meteor.userId()});
    var planId = '';
    if (subscription.subscriptionPlan == 'monthly') {
      planId = 'archive-service-monthly';
    }
    if (subscription.subscriptionPlan == 'annual') {
      planId = 'archive-service-annual';
    }
    Meteor.call('mdChargeBeeCreateSubscription', cbCustomer.customerId, planId, function (err, res) {
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