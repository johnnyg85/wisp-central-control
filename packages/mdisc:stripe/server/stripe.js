StripeMeteor = {};

StripeAPI = Npm.require('stripe');
Future = Npm.require('fibers/future');

var Stripe = StripeAPI(Meteor.settings.stripe.secretKey);

StripeMeteor.charge = function (stripeToken, amount, description, callback) {
    Stripe.charges.create({
        amount: amount,
        currency: "usd",
        source: stripeToken,
        description: description
    }, callback);
};

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

StripeMeteor.cancelSubscription = function(customerId, subscriptionId, callback) {
    Stripe.customers.cancelSubscription(customerId, subscriptionId, callback);
};

StripeMeteor.changeSubscriptionPlan = function(customerId, subscriptionId, newPlan, callback) {
    Stripe.customers.updateSubscription(customerId, subscriptionId, { plan: newPlan}, callback);
};


StripeMeteor.logWebHook = function (data) {
    MdStripeMeteor.webhooks.insert(data);
};

StripeMeteor.processWebHook = function (data) {
    switch (data.type) {
        case 'customer.subscription.updated':
            var subsId = data.data.object.id;
            var cusId = data.data.object.customer;
            var new_current_period_start = data.data.object.current_period_start;
            var new_current_period_end = data.data.object.current_period_end;
            var customer = MdStripeMeteor.customers.findOne({"customerid": cusId});
            if (customer) {
                for (i in customer.subscriptions.data) {
                    if (customer.subscriptions.data[i].id==subsId) {
                        customer.subscriptions.data[i].current_period_start = new_current_period_start;
                        customer.subscriptions.data[i].current_period_end = new_current_period_end;
                    }
                }
                MdStripeMeteor.customers.update({"customerid": cusId}, {$set: {"subscriptions":customer.subscriptions}});
            }
            break;
    }
};

StripeMeteor.checkCustomerUserId = function(userId, customerId) {
    if (MdStripeMeteor.customers.findOne({userId: userId, customerid: customerId})) {
        return true;
    }
    return false;
};

StripeMeteor.successfulOneTimePayment = function(charge) {
    console.log("Payment Successful");
};