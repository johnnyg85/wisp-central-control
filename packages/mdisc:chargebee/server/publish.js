Meteor.publish('chargebeecustomers', function () {
  return MdChargeBeeMeteor.customers.find({owner: this.userId});
});