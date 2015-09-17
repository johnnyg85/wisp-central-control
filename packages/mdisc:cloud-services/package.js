Package.describe({
  name: 'mdisc:cloud-services',
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
    'templating',
    'oauth',
    'mdisc:cloud-service-google-photo',
    'mdisc:cloud-service-dropbox',
    'wisptools:collection',
    'meteorhacks:async',
    'mdisc:archive'
  ]);  

  api.addFiles([
    'lib/collections.js'
    ], ['server','client']);

  api.addFiles([
    'client/templates/show-few-photos.html',
    'client/templates/show-few-photos.js'
    ], ['client']);


  api.addFiles([
    'server/methods.js',
    'server/functions.js'
    ], ['server']);

  api.export('MdCloudServices');
  api.export('OAuth');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mdisc:cloud-services');
  api.addFiles('cloud-services-tests.js');
});
