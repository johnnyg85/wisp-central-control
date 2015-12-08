Package.describe({
  name: 'mdisc:jobs-subscriptions',
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
  api.versionsFrom('1.2.1');

  api.use([
    'ecmascript',
    'templating',
    'iron:router@1.0.7',
    'wisptools:menu',
    'wisptools:collection',
    'wisptools:roles',
    'vsivsi:job-collection@1.2.3'
  ]);    

  api.addFiles([
    'lib/jobs-subscriptions.js'
    ], ['server','client']);

  api.addFiles([
    'server/methods.js'
    ], ['server']);

  api.export('MdJobsSubscriptions');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('mdisc:jobs-subscriptions');
  api.addFiles('jobs-subscriptions-tests.js');
});
