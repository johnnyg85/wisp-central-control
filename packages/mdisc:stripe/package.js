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
    api.use(['templating'], 'client');
    api.export('StripeMeteor');
    api.addFiles('stripe-client.html', 'client');
    api.addFiles('stripe-client.js', 'client');
    api.addFiles('stripe-server.js', 'server');
});

