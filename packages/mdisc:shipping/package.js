Package.describe({
    name: 'mdisc:shipping',
    version: '0.0.1',
    summary: 'Meteor package for shipping page',
    git: '',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.3');
    
    api.use([
        'templating',
        'iron:router@1.0.7',
        'mongo',
        'wisptools:collection',
        'wisptools:menu'
    ]);
    
    api.export('');
    
    api.addFiles([
        'client/menu.js',
        'client/templates/shipping.html',
        'client/templates/shipping.js'
    ], 'client');

    api.addFiles([
        'server/methods.js'
    ], 'server');
    
    api.addFiles([
        'lib/router.js'
    ], ['server', 'client']);
});
