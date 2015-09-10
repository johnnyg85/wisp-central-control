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
        'wisptools:collection'
    ]);
    api.export('StripeMeteor');
    api.export('MdStripeMeteor');
    api.addFiles([
        'stripe-client.html',
        'stripe-client.js',
        'client/templates/stripe-payment.html',
        'client/templates/stripe-payment.js'
    ], 'client');

    api.addFiles([
        'stripe-server.js',
        'server/methods.js'
    ], 'server');
    
    api.addFiles([
        'lib/router.js',
        'lib/collections.js'
    ], ['server', 'client']);
});

