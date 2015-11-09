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
    'google',
    'meteorhacks:async',
    'wisptools:menu',
    'mdisc:busy',
    'mdisc:archive',
    'mdisc:aes',
    'wisptools:growl'
  ]);  

  // Server only files
  api.addFiles([
    'server/g-photos.js'
    ], 'server');

  // Client only files
  api.addFiles([
    'client/templates/connect.css',
    'client/templates/connect.html',
    'client/templates/connect.js',
    'client/templates/show-photos.css',
    'client/templates/show-photos.html',
    'client/templates/show-photos.js',
    'client/templates/finalize-order.html',
    'client/templates/finalize-order.js',
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
