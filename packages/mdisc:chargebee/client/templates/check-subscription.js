Template.mdChargeBeeCheckSubscription.helpers({
  checking: function () {
    return Session.get('cb_fetching_subscription');
  },
  hasSubscription: function () {
    return Session.get('cb_has_subscription');
  },
  getSubscriptions: function () {
    return Session.get('cb_subscriptions');
  },
  formatDate: function (timestamp) {
    var d = new Date(timestamp*1000);
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
});

Template.mdChargeBeeCheckSubscription.events({
  'click .accountBtn': function () {
    Router.go('mdMyAccount');
  }
});

Template.mdChargeBeeCheckSubscription.onRendered(function () {
  Session.set('cb_has_subscription', false);
  Session.set('cb_fetching_subscription', false);
  Session.set('cb_subscriptions', 'false');
  get_subscriptions();
});

function get_subscriptions() {
  Session.set('cb_fetching_subscription', true);
  Meteor.call('mdChargeBeeListSubscriptions', function (err, res) {
    Session.set('cb_fetching_subscription', false);
    if (!err) {
      var hasActiveSubscription = false;
      var activeSubscriptions = new Array;
      if (res && res.length > 0) {
        for (var i = 0; i < res.length; i++) {
          if (res[i].subscription.status && res[i].subscription.status == 'active') {
            hasActiveSubscription = true;
            activeSubscriptions.push(res[i]);
          }
        }
      }
      if (hasActiveSubscription) {
        Session.set('cb_has_subscription', true);
        Session.set('cb_subscriptions', activeSubscriptions);
      }
    }
  });
}