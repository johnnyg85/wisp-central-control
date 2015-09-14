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
                MdStripeMeteor.subscriptions.insert({
                    userId: Meteor.userId(),
                    customerid: customer.id,
                    email: customer.email,
                    plan: planid,
                    subscriptions: customer.subscriptions
                });
            }));
        }
    },
});

/* Need to run only once when plans are created */
//Meteor.call('createStripePlan', 'plan1', "Plan 1", "month", 500);
//Meteor.call('createStripePlan', 'plan2', "Plan 2", "month", 700);
//Meteor.call('createStripePlan', 'plan3', "Plan 3", "month", 1000);