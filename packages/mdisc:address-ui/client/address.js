Template.mdAddress.helpers({
  shipTo: function () {
    return Meteor.user().profile.shipTo;    
  },
  selected: function (a, b) {
    return a == b ? 'selected' : '';
  }  
});