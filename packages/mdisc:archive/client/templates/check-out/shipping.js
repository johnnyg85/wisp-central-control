Template.mdArchiveShipping.events({
  'submit': function(e, t) {
    e.preventDefault();
    e.stopPropagation();

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

    WtAccordionPage.enable('arch_pay');
    WtAccordionPage.show('arch_pay');

    // Update the account address
    Meteor.users.update({_id: Meteor.userId()}, { $set:{"profile.shipTo": shipTo}}, function (err, res) {});

  }
});


Template.mdArchiveShipping.helpers({
  shipTo: function () {
    return Meteor.user().profile.shipTo;    
  }
});
