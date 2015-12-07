
Template.mdMyAccountCancelSubModal.helpers({
  getSubscription: function () {
    return Session.get('cancel_subscription');
  },
  planName: function (planId) {
    return MdChargeBee.planIdToName(planId);
  }
});

Template.mdMyAccountCancelSubModal.events({
  'click #confBtn': function () {
    if ($('#confText').val().toUpperCase() === 'CANCEL') {
      Session.set('cancel_subscription_confirmation', true);
      cancel_subscription();
    } else {
      $('#confSubCancelModal').modal('hide');
      WtGrowl.fail("Please enter CANCEL in the box to cancel subscription.");
    }
  }
});


function cancel_subscription() {
  var subscription = Session.get('cancel_subscription');
  var conf = Session.get('cancel_subscription_confirmation');
  if (subscription && conf) {
    Meteor.call('mdChargeBeeCancelSubscription', subscription.id, function (err, res) {
      $('#confSubCancelModal').modal('hide');
      if (err) {
        WtGrowl.fail("Failed to cancel subscription.");
      } else {
        WtGrowl.success("Subscription has been cancelled.");
      }
      Session.set('cb_has_subscription', false);
      Session.set('cb_fetching_subscription', false);
      Session.set('cb_subscriptions', 'false');
      Session.set('cancel_subscription', false);
      Session.set('cancel_subscription_confirmation', false);
      $('#confText').val('');
      get_subscriptions();
    });
  }
}