Meteor.methods({
  //Creates a new ChargeBee customer if current user does not have a customer entry.
  //Updates the customer entry if the current user already has a ChargeBee customer entry.
  cbCreateCustomer: function (firstName, lastName, email, billingAddress) {
    var cbCustomer = MdChargeBeeMeteor.customers.findOne({owner: this.userId});
    if (cbCustomer) {
      var myFuture = new Future();
      ChargeBeeMeteor.updateCustomer(cbCustomer.customerId, firstName, lastName, email, Meteor.bindEnvironment(function (err, result) {
        if (err) {
          myFuture.return({status: "error", msg: err.message});
        } else {
          MdChargeBeeMeteor.customers.update({customerId: result.customer.id}, {$set: {
            customer: result.customer
          }});
          myFuture.return({status: "success"});
        }
      }));
      var result = myFuture.wait();
      if (result.status == "error") {
        throw new Meteor.Error("chargebee-error", result.msg);
      }
      
      var myFuture = new Future();
      ChargeBeeMeteor.updateBillingInfoForCustomer(cbCustomer.customerId, billingAddress, Meteor.bindEnvironment(function (err, result) {
        if (err) {
          myFuture.return({status: "error", msg: err.message});
        } else {
          MdChargeBeeMeteor.customers.update({customerId: result.customer.id}, {$set: {
            customer: result.customer
          }});
          myFuture.return({status: "success"});
        }
      }));
      var result = myFuture.wait();
      if (result.status == "error") {
        throw new Meteor.Error("chargebee-error", result.msg);
      }
    } else {
      var myFuture = new Future();
      ChargeBeeMeteor.createCustomer(firstName, lastName, email, billingAddress, Meteor.bindEnvironment(function (err, result) {
        if (err) {
          myFuture.return({status: "error", msg: err.message});
        } else {
          MdChargeBeeMeteor.customers.insert({
            customerId: result.customer.id,
            customer: result.customer
          });
          myFuture.return({status: "success"});
        }
      }));
      var result = myFuture.wait();
      if (result.status == "error") {
        throw new Meteor.Error("chargebee-error", result.msg);
      }
    }
  }
});