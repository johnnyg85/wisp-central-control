Template.mdAddress.helpers({
  shipTo: function () {
    if (!Meteor.user() || !Meteor.user().profile || !Meteor.user().profile.shipTo) return {};
    return Meteor.user().profile.shipTo;    
  },
  selected: function (a, b) {
    return a == b ? 'selected' : '';
  },
  displayAdd2: function (add2) {
    return (add2 || Session.get('mdAddressDisplayAdd2'));
  }
});

Template.mdAddress.events({
  'click .add2ndLine': function () {
    Session.set('mdAddressDisplayAdd2', true);
  }
});

Template.mdAddress.onRendered(function () {
    Session.set('mdAddressDisplayAdd2', false);
});