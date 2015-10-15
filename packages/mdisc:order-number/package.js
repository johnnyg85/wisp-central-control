Package.describe({
    name: 'mdisc:order-number',
    version: '0.0.1',
    summary: 'Meteor package that handles order numbers.',
    git: '',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.3');
    api.use([
        'mongo',
        'wisptools:collection'
    ]);
    
    api.export('MdOrderNumber');
    
    api.addFiles([
        'server/methods.js',
        'lib/order-number.js'
    ], 'server');
});
