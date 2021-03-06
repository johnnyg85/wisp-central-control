Package.describe({
    name: 'mdisc:easypost',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.2.0.2');
    api.use([
        'meteor',
        'adyus:easypost@2.0.7',
        'iron:router@1.0.7',
        'templating',
        'mongo',
        'wisptools:collection',
        'wisptools:menu',
        'themeteorchef:jquery-validation@1.14.0',
        'wisptools:tab-page'
    ]);

    api.addFiles([
        'lib/router.js'

    ], ['server', 'client']);

    api.addFiles([
        'client/templates/main.html',
        'client/templates/main.js',
        'client/templates/shippinglabel.html',
        'client/templates/shippinglabel.js',
        'client/templates/easypost.html',
        'client/templates/easypost.js',
        'client/templates/parcel.html',
        'client/templates/parcel.js',
        'client/templates/trackShipment.html',
        'client/templates/trackShipment.js',
        'client/menu.js'
    ], ['client']);

    api.addFiles([
        'server/methods.js'
    ], ['server']);

});

Package.onTest(function(api) {

    api.use('tinytest');
    api.use('mdisc:easypost');
    api.addFiles('easypost-tests.js');
});
