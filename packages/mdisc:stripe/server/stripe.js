StripeMeteor = {};

StripeAPI = Npm.require('stripe');
var Stripe = StripeAPI(Meteor.settings.stripe.secretKey);

StripeMeteor.createCustomer = function (stripeToken, planid, email, callback) {
    Stripe.customers.create({
        source: stripeToken,
        plan: planid,
        email: email
    }, function (err, customer) {
        if (err) {
            console.log(err.message);
        } else {
            callback(customer);
        }
    });
};

StripeMeteor.createPlan = function (id, name, interval, amount, callback) {
    Stripe.plans.create({
        id: id,
        name: name,
        currency: "usd",
        interval: interval,
        amount: amount
    }, function (err, plan) {
        if (err) {
            console.log(err.message);
        } else {
            callback(plan);
        }
    });
};

