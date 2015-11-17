ChargeBeeMeteor = {};

ChargeBeeAPI = Npm.require('chargebee');
Future = Npm.require('fibers/future');

ChargeBeeAPI.configure({
  site: Meteor.settings.chargebee.site,
  api_key: Meteor.settings.chargebee.apiKey
});

ChargeBeeMeteor.createCustomer = function (firstName, lastName, email, billingAddress, callback) {
  if (!firstName || !lastName || !email || !billingAddress) {
    throw new Meteor.Error("chargebee-error", 'ChargeBee create customer - Invalid parameters.');
  }
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

ChargeBeeMeteor.updateCustomer = function (customerId, firstName, lastName, email, callback) {
  if (!customerId || !firstName || !lastName || !email) {
    throw new Meteor.Error("chargebee-error", 'ChargeBee update customer - Invalid parameters.');
  }
  ChargeBeeAPI.customer.update(customerId, {
    first_name: firstName,
    last_name: lastName,
    email: email
  }).request(callback);
};

ChargeBeeMeteor.updateBillingInfoForCustomer = function (customerId, billingAddress, callback) {
  if (!customerId || !billingAddress) {
    throw new Meteor.Error("chargebee-error", 'ChargeBee update billing info - Invalid parameters.');
  }
  ChargeBeeAPI.customer.update_billing_info(customerId, {
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

ChargeBeeMeteor.updateCardForCustomer = function (customerId, cardDetails, callback) {
  if (!customerId || !cardDetails) {
    throw new Meteor.Error("chargebee-error", 'ChargeBee update card info - Invalid parameters.');
  }
  if (cardDetails && (!cardDetails.number || !cardDetails.expMonth || !cardDetails.expYear || !cardDetails.cvv)) {
    throw new Meteor.Error("chargebee-error", 'ChargeBee update card info - Invalid parameters.');
  }
  ChargeBeeAPI.card.update_card_for_customer(customerId, {
    gateway: "chargebee",
    number: cardDetails.number,
    expiry_month: cardDetails.expMonth,
    expiry_year: cardDetails.expYear,
    cvv: cardDetails.cvv
  }).request(callback);
};

ChargeBeeMeteor.createSubscriptionForCustomer = function (customerId, planId, callback) {
  if (!customerId || !planId) {
    throw new Meteor.Error("chargebee-error", 'ChargeBee create subscription - Invalid parameters.');
  }
  ChargeBeeAPI.subscription.create_for_customer(customerId, {
    plan_id: planId
  }).request(callback);
};

ChargeBeeMeteor.listSubscriptionsForCustomer = function (customerId, limit, callback) {
  if (!customerId || !limit) {
    throw new Meteor.Error("chargebee-error", 'ChargeBee create subscription - Invalid parameters.');
  }
  if (limit && (limit<1 || limit>100)) {
    throw new Meteor.Error("chargebee-error", 'ChargeBee create subscription - Invalid parameters.');
  }
  ChargeBeeAPI.subscription.subscriptions_for_customer(customerId, {
    limit: limit
  }).request(callback);
};