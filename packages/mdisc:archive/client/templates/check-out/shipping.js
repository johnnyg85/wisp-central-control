
Template.mdArchiveShipping.onRendered(function() {
  Meteor.call('getFullName', function(err, res) {
    if (err) return;
    Session.set('fullName', res);
  });
});

Template.mdArchiveShipping.helpers({
  shipTo: function () {
    return Meteor.user().profile.shipTo;    
  },
  shipToName: function () {
    var user = Meteor.user().profile.shipTo
    if (user && user.profile && user.profile.shipTo && user.profile.shipTo.name)
      return user.profile.shipTo.name;
    return Session.get('fullName');
  }
});

Template.mdArchiveShipping.events({
  'submit': function(e, t) {
    e.preventDefault();
    e.stopPropagation();
    $(e.target).find('button').prop('disabled', true);

    var subscription = MdArchive.subscription.findOne({owner: Meteor.userId()});
    var formData = {};
    var shipTo;

    // Build object of form data
    for (var x = 0; x < e.target.length; x++) {
      if (e.target[x].name) {
        formData[e.target[x].name] = e.target[x].value;
      }
    }

    shipTo = {
      name: formData.name,
      address: formData.address,
      address2: formData.address2,
      city: formData.city,
      state: formData.state,
      zip: formData.zip
    };

    MdArchive.subscription.update({_id: subscription._id}, {$set: {shipTo: shipTo}});
    
    var billingAddress = {
      first_name: shipTo.name,
      line1: shipTo.address,
      line2: shipTo.address2,
      city: shipTo.city,
      state: shipTo.state,
      zip: shipTo.zip
    };
    Meteor.call('mdChargeBeeCreateCustomer', shipTo.name, ' ', billingAddress, function (err, res) {
      $(e.target).find('button').prop('disabled', false);
      if (err) {
        WtGrowl.fail("Failed to create/update ChargeBee customer.");
        console.log(err.reason);
      } else {
        WtAccordionPage.enable('arch_pay');
        WtAccordionPage.show('arch_pay');
      }
    });

    // Update the account address
    Meteor.users.update({_id: Meteor.userId()}, { $set:{"profile.shipTo": shipTo}}, function (err, res) {});

  }
});
