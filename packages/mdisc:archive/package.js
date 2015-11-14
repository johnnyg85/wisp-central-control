Package.describe({
  name: 'mdisc:archive',
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
    'mongo',
    'templating',
    'iron:router@1.0.7',
    'wisptools:collection',
    'wisptools:menu',
    'wisptools:growl',
    'wisptools:tab-page',
    'mdisc:jobs',
    'mdisc:accounts',
    'mdisc:address-ui'
  ]);

  api.addFiles([
    'client/templates/admin-view.html',
    'client/templates/admin-view.js',
    'client/templates/check-out/name.html',
    'client/templates/check-out/name.js',
    'client/templates/check-out/payment.html',
    'client/templates/check-out/payment.js',
    'client/templates/check-out/plan.html',
    'client/templates/check-out/plan.js',
    'client/templates/check-out/review.html',
    'client/templates/check-out/review.js',
    'client/templates/check-out/shipping.html',
    'client/templates/check-out/shipping.js',
    'client/menu.js'
    ], ['client']);

  api.addFiles([
    'lib/collection.js',
    'lib/methods.js',
    'lib/router.js',
    'lib/functions.js'
    ], ['server','client']);

  api.addFiles([
    'server/functions.js',
    'server/methods.js'
    ], ['server']);

  api.export('MdArchive');

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mdisc:archive');
  api.addFiles('archive-tests.js');
});
