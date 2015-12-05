Package.describe({
  name: 'mdisc:cloud-service-google-photo',
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
  api.versionsFrom('1.1.0.2');

  api.use([
    'meteor',
    'http',
    'templating',
    'iron:router',
    'oauth',
    'google',
    'accounts-base',
    'service-configuration',
    'meteorhacks:async@1.0.0',
    'wisptools:accordion-page',
    'wisptools:menu',
    'mdisc:busy',
    'mdisc:archive',
    'mdisc:aes',
    'wisptools:growl'
  ]);  

  // Server only files
  api.addFiles([
    'server/startup.js',
    'server/g-photos.js'
    ], 'server');

  // Client only files
  api.addFiles([
    'client/templates/connect.css',
    'client/templates/connect.html',
    'client/templates/connect.js',
    'client/templates/connect-check-login.html',
    'client/templates/connect-check-login.js',
    'client/templates/connect-check-token.html',
    'client/templates/connect-check-token.js',
    'client/templates/no-photos.css',
    'client/templates/no-photos.html',
    'client/templates/show-photos.css',
    'client/templates/show-photos.html',
    'client/templates/show-photos.js',
    'client/templates/finalize-order.html',
    'client/templates/finalize-order.js',
    'client/templates/finalize-order.css',
    'client/templates/order-placed.html',
    'client/templates/order-placed.js',
    'client/google-photos.js',
    'client/menu.js'
    ], 'client');

  // Server and Client files
  api.addFiles([
    'lib/router.js'
    ], ['server', 'client']);
  
  api.export('gPhotos', 'server');  
  api.export('googlePhotos', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mdisc:cloud-service-google-photo');
  api.addFiles('cloud-service-google-photo-tests.js');
});
