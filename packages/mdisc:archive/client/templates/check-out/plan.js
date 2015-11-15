Template.mdArchivePlan.helpers({
  selected: function (plan) {
    var selectedPlan = Session.get('selectedPlan');
    if (plan == selectedPlan) return 'selected';
  }
});

Template.mdArchivePlan.onRendered(function () {
  Session.set('selectedPlan', 'annual');
});

Template.mdArchivePlan.events({
  'click .annual': function (e, t) {
    Session.set('selectedPlan', 'annual');
  },
  'click .monthly': function (e, t) {
    Session.set('selectedPlan', 'monthly');
  },
  'submit #archive-plan-form': function(e, t) {
    e.preventDefault();
    var selectedPlan = Session.get('selectedPlan');
    var subscription = MdArchive.subscription.findOne({owner: Meteor.userId()});
    MdArchive.subscription.update({_id: subscription._id}, {$set: {subscriptionPlan: selectedPlan}});
    WtAccordionPage.show('arch_shipping');
  }
});