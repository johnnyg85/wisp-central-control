Template.mdArchivePlan.helpers({
  selected: function (plan) {
    var subscription = MdArchive.subscription.findOne({owner: Meteor.userId()});
    selectedPlan = subscription && subscription.subscriptionPlan;
    if (plan == selectedPlan) return 'selected';
  }
});

Template.mdArchivePlan.events({
  'click .annual': function (e, t) {
    Session.set('selectedPlan', 'annual');
    var subscription = MdArchive.subscription.findOne({owner: Meteor.userId()});
    MdArchive.subscription.update({_id: subscription._id}, {$set: {subscriptionPlan: 'annual'}});
  },
  'click .monthly': function (e, t) {
    Session.set('selectedPlan', 'monthly');
    var subscription = MdArchive.subscription.findOne({owner: Meteor.userId()});
    MdArchive.subscription.update({_id: subscription._id}, {$set: {subscriptionPlan: 'monthly'}});
  },
  'submit #archive-plan-form': function(e, t) {
    e.preventDefault();
    WtAccordionPage.enable('arch_shipping');
    WtAccordionPage.show('arch_shipping');
  }
});