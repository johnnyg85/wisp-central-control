Template.mdMyAccount.helpers({
  orders: function() {
    return MdArchive.collection.find().fetch();
  },
  user: function() {
    return Meteor.user();
  },
});

Template.mdMyAccountOrder.helpers({
  show: function(status) {
    if (status == 'Open') {
      return false;
    } else {
      return true;
    }
  }
});

Template.mdMyAccountShippingForm.helpers({
  user: function() {
    return Meteor.user();
  }
});

Template.mdMyAccountShippingForm.events({
  'submit': function(e, t) {
    e.preventDefault();

    var archiveId = Session.get('openArchiveId');
    var shipTo = {};

    // Add form values to shipTo
    for (var x = 0; x < e.target.length; x++) {
      if (e.target[x].name) {
        shipTo[e.target[x].name] = e.target[x].value;
      }
    }

    // Update the account address
    Meteor.users.update({_id: Meteor.userId()}, { $set:{"profile.shipTo": shipTo}}, function (err, res) {
      if (err)
        WtGrowl.fail("Could not update Shipping Information");
      else
        WtGrowl.success("Shipping Information updated");
    });

    // Update the first name
    var name = shipTo.name.trim();
    if (name.indexOf(' ') > 0)
      name = name.slice(0, name.indexOf(' '));
    Meteor.users.update({_id: Meteor.userId()}, { $set:{"profile.firstname": name}} )

  },
});
