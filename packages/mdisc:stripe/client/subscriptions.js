StripeMeteor = {};

Meteor.startup(function () {
    Stripe.setPublishableKey(Meteor.settings.public.stripe.publishableKey);
});

Meteor.subscribe('stripeplans');
Meteor.subscribe('stripecustomers');