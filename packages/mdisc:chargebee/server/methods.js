Meteor.methods({
  createCustomer: function (firstName, lastName, email, billingAddress) {
    ChargeBeeMeteor.createCustomer(firstName, lastName, email, billingAddress, function (err, result) {
      if (err) {
        throw new Meteor.Error("chargebee-error", err.message);
      } else {
        //Save customer to a collection
      }
    });
  }
});