ChargeBeeMeteor = {};

ChargeBeeAPI = Npm.require('chargebee');

ChargeBeeAPI.configure({
  site: Meteor.settings.chargebee.site,
  api_key: Meteor.settings.chargebee.apiKey
});

ChargeBeeMeteor.createCustomer = function (firstName, lastName, email, billingAddress, callback) {
  ChargeBeeAPI.customer.create({
    first_name: firstName,
    last_name: lastName,
    email: email,
    billing_address: {
      first_name: billingAddress.firstName,
      last_name: billingAddress.lastName,
      line1: billingAddress.address1,
      line2: billingAddress.address2,
      city: billingAddress.city,
      state: billingAddress.state,
      zip: billingAddress.zip,
      country: billingAddress.country
    }
  }).request(callback);
};

ChargeBeeMeteor.updateCardForCustomer = function (customerId, firstName, lastName, cardDetails, callback) {
  ChargeBeeAPI.card.update_card_for_customer(customerId, {
    gateway: "chargebee",
    first_name: firstName,
    last_name: lastName,
    number: cardDetails.number,
    expiry_month: cardDetails.expMonth,
    expiry_year: cardDetails.expYear,
    cvv: cardDetails.cvv
  }).request(callback);
};

ChargeBeeMeteor.createSubscriptionForCustomer = function (customerId, planId, callback) {
  ChargeBeeAPI.subscription.create_for_customer(customerId, {
    plan_id: planId
  }).request(callback);
};

ChargeBeeMeteor.listSubscriptionsForCustomer = function (customerId, limit, callback) {
  ChargeBeeAPI.subscription.subscriptions_for_customer(customerId, {
    limit: limit
  }).request(callback);
};