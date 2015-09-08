StripeMeteor = {};

StripeAPI = Npm.require('stripe');


StripeMeteor.chargeCard = function (stripeToken, amount, currency) {
    var Stripe = StripeAPI(Meteor.settings.stripe.secretKey);
    
    Stripe.charges.create({
        amount: amount,
        currency: currency,
        source: stripeToken
    }, function (err, charge) {
        console.log(err, charge);
    });
}
