Meteor.methods({
  //Creates a new ChargeBee customer if current user does not have a customer entry.
  //Updates the customer entry if the current user already has a ChargeBee customer entry.
  //Returns customer object.
  cbCreateCustomer: function (firstName, lastName, billingAddress) {
    var cbCustomer = MdChargeBeeMeteor.customers.findOne({owner: this.userId});
    if (cbCustomer) {
      var myFuture = new Future();
      ChargeBeeMeteor.updateCustomer(cbCustomer.customerId, firstName, lastName, Meteor.bindEnvironment(function (err, result) {
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
      return cbCustomer;
    } else {
      var myFuture = new Future();
      ChargeBeeMeteor.createCustomer(firstName, lastName, billingAddress, Meteor.bindEnvironment(function (err, result) {
        if (err) {
          myFuture.return({status: "error", msg: err.message});
        } else {
          MdChargeBeeMeteor.customers.insert({
            customerId: result.customer.id,
            customer: result.customer
          });
          myFuture.return({status: "success", data: result.customer});
        }
      }));
      var result = myFuture.wait();
      if (result.status == "error") {
        throw new Meteor.Error("chargebee-error", result.msg);
      }
      return result.data;
    }
  },
  
  cbUpdateCardInfo: function (customerId, cardDetails) {
    var cbCustomer = MdChargeBeeMeteor.customers.findOne({owner: this.userId});
    if (!cbCustomer) {
      throw new Meteor.Error("chargebee-error", 'ChargeBee customer does not exist');
    }
    if (!cardDetails || (cardDetails && (!cardDetails.number || !cardDetails.expMonth || !cardDetails.expYear || !cardDetails.cvv))) {
      throw new Meteor.Error("chargebee-error", 'ChargeBee update card info - Invalid parameters.');
    }
    cardDetails.number = MdAES.decrypt(cardDetails.number);
    cardDetails.expMonth = MdAES.decrypt(cardDetails.expMonth);
    cardDetails.expYear = MdAES.decrypt(cardDetails.expYear);
    cardDetails.cvv = MdAES.decrypt(cardDetails.cvv);
    var myFuture = new Future();
    ChargeBeeMeteor.updateCardForCustomer(customerId, cardDetails, Meteor.bindEnvironment(function (err, result) {
      if (err) {
        myFuture.return({status: "error", msg: err.message});
      } else {
        MdChargeBeeMeteor.customers.update({customerId: result.customer.id}, {$set: {
          card: result.card
        }});
        myFuture.return({status: "success", data: result.card});
      }
    }));
    var result = myFuture.wait();
    if (result.status == "error") {
      throw new Meteor.Error("chargebee-error", result.msg);
    }
    return result.data;
  },
  
  cbCreateSubscription: function (customerId, planId) {
    var cbCustomer = MdChargeBeeMeteor.customers.findOne({owner: this.userId});
    if (!cbCustomer) {
      throw new Meteor.Error("chargebee-error", 'ChargeBee customer does not exist');
    }
    var myFuture = new Future();
    ChargeBeeMeteor.createSubscriptionForCustomer(customerId, planId, Meteor.bindEnvironment(function (err, result) {
      if (err) {
        myFuture.return({status: "error", msg: err.message});
      } else {
        MdChargeBeeMeteor.customers.update({customerId: result.customer.id}, {$set: {
          subscription: result.subscription
        }});
        myFuture.return({status: "success", data: result.subscription});
      }
    }));
    var result = myFuture.wait();
    if (result.status == "error") {
      throw new Meteor.Error("chargebee-error", result.msg);
    }
    return result.data;
  },
  
  cbListSubscriptions: function () {
    var cbCustomer = MdChargeBeeMeteor.customers.findOne({owner: this.userId});
    if (!cbCustomer) {
      //throw new Meteor.Error("chargebee-error", 'ChargeBee customer does not exist');
      //Returns false instead of throwing an error indicating that subscription does not exist.
      return false;
    }
    var myFuture = new Future();
    //NOTE: Need to add code that hanldles more than 100 subscriptions.
    ChargeBeeMeteor.listSubscriptionsForCustomer(cbCustomer.customerId, 100, Meteor.bindEnvironment(function (err, result) {
      if (err) {
        myFuture.return({status: "error", msg: err.message});
      } else {
        myFuture.return({status: "success", data: result.list});
      }
    }));
    var result = myFuture.wait();
    if (result.status == "error") {
      throw new Meteor.Error("chargebee-error", result.msg);
    }
    return result.data;
  }
});