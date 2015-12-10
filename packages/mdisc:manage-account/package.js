Package.describe({
  name: 'mdisc:manage-account',
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
    'templating',
    'iron:router@1.0.7',
    'steeve:moment-dateformat@0.0.1',
    'wisptools:menu',
    'mdisc:accounts',
    'mdisc:address-ui',
    'wisptools:growl',
    'mdisc:cloud-service-google-photo',
    'mdisc:cloud-services',
    'mdisc:easypost',
    'wisptools:date-format',
    'mdisc:archive',
    'mdisc:chargebee',
    'mdisc:dates'
  ]);
  
  api.addFiles([
    'client/templates/my-account.css',
    'client/templates/my-account.html',
    'client/templates/my-account.js',
    'client/templates/subscription.html',
    'client/templates/subscription.js',
    'client/templates/cancel.html',
    'client/templates/cancel.js',
    'client/templates/change-card.html',
    'client/templates/change-card.js'
    ], 'client');

  api.addFiles([
    'lib/router.js'
    ], ['client', 'server']);

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('mdisc:manage-account');
  api.addFiles('manage-account-tests.js');
});
