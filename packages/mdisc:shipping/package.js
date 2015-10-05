Package.describe({
    name: 'mdisc:shipping',
    version: '0.0.1',
    summary: 'Meteor package for shipping page',
    git: '',
    documentation: 'README.md'
});

Npm.depends({"quagga": "0.7.0"});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.3');
    
    api.use([
        'templating',
        'iron:router@1.0.7',
        'mongo',
        'wisptools:collection',
        'wisptools:menu',
        'mdisc:archive',
        'mrt:qr-scanner@0.2.0'
    ]);
    
    //api.export('');
    
    api.addFiles([
        'client/menu.js',
        'client/subscriptions.js',
        'client/templates/shipping.html',
        'client/templates/shipping.js',
        'client/templates/shipping_scan.html',
        'client/templates/shipping_scan.js'
    ], 'client');

    api.addFiles([
        'server/methods.js',
        'server/publish.js'
    ], 'server');
    
    api.addFiles([
        'lib/router.js',
        'lib/collections.js'
    ], ['server', 'client']);
});
