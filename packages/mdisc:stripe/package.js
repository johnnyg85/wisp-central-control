Package.describe({
    name: 'mdisc:stripe',
    version: '0.0.1',
    summary: 'Meteor package for Stripe payment gateway.',
    git: '',
    documentation: 'README.md'
});

Npm.depends({"stripe": "3.2.0"});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.3');
    api.use([
        'templating',
        'iron:router@1.0.7',
        'mongo',
        'wisptools:collection',
        'wisptools:growl',
        'mdisc:address-ui',
        'mdisc:dates'
    ]);
    api.export('StripeMeteor');
    api.export('MdStripeMeteor');
    api.addFiles([
        'client/header.html',
        'client/subscriptions.js',
        'client/templates/subscription/stripe-payment.html',
        'client/templates/subscription/stripe-payment.js',
        'client/templates/subscription/stripe-payment-form.html',
        'client/templates/subscription/stripe-payment-form.js',
        'client/templates/subscription/stripe-payment-subscription.html',
        'client/templates/subscription/stripe-payment-subscription.js',
        'client/templates/onetimepayment/stripe-payment.html',
        'client/templates/onetimepayment/stripe-payment.js',
        'client/templates/onetimepayment/stripe-payment-simple.html',
        'client/templates/onetimepayment/stripe-payment-simple.js'
    ], 'client');

    api.addFiles([
        'server/stripe.js',
        'server/publish.js',
        'server/methods.js'
    ], 'server');
    
    api.addFiles([
        'lib/router.js',
        'lib/collections.js'
    ], ['server', 'client']);
});

