Meteor.methods({
    createStripePlan: function (planid, name, interval, amount) {
        /*
         * TODO: Only admin needs access to this method
         */
        StripeMeteor.createPlan(planid, name, interval, amount, Meteor.bindEnvironment(function(plan) {
            MdStripeMeteor.plans.insert({
                planid: plan.id,
                name: plan.name,
                currency: plan.currency,
                interval: plan.interval,
                amount: plan.amount
            });
        }));
    },
    
    getStripePlans: function () {
        return MdStripeMeteor.plans.find();
    },
    
    createCustomer: function (stripeToken, planid, email) {
        if (!email) {
            throw new Meteor.Error("validation-error", "Please provide a valid email id.");
        } else if (!planid) {
            throw new Meteor.Error("validation-error", "Please select a valid plan.");
        } else {
            StripeMeteor.createCustomer(stripeToken, planid, email, Meteor.bindEnvironment(function (customer) {
                MdStripeMeteor.customers.insert({
                    userId: Meteor.userId(),
                    customerid: customer.id,
                    email: customer.email,
                    plan: planid,
                    subscriptions: customer.subscriptions
                });
            }));
        }
    },
    
    cancelSubscription: function(customerId, subscriptionId) {
        if (!customerId || !subscriptionId) {
            throw new Meteor.Error("validation-error", "Customer ID and Subscription ID required.");
        } else if (!StripeMeteor.checkCustomerUserId(Meteor.userId(), customerId)) {
            throw new Meteor.Error("validation-error", "You don't have enough permission to cancel this subscription.");
        } else {
            StripeMeteor.cancelSubscription(customerId, subscriptionId, Meteor.bindEnvironment(function (err, confirmation) {
                if (err) {
                    throw new Meteor.Error("stripe-error", err.message);
                } else {
                    var customer = MdStripeMeteor.customers.findOne({"customerid": customerId});
                    if (customer) {
                        for (i in customer.subscriptions.data) {
                            if (customer.subscriptions.data[i].id == subscriptionId) {
                                customer.subscriptions.data[i] = confirmation;
                            }
                        }
                        MdStripeMeteor.customers.update({"customerid": customerId}, {$set: {"subscriptions": customer.subscriptions}});
                    }
                }
            }));
        }
    }
    
});

/* Need to run only once when plans are created */
//Meteor.call('createStripePlan', 'plan1', "Plan 1", "month", 500);
//Meteor.call('createStripePlan', 'plan2', "Plan 2", "month", 700);
//Meteor.call('createStripePlan', 'plan3', "Plan 3", "month", 1000);