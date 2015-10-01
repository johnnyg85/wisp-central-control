Package.describe({
  name: 'wisptools:powercode-commission',
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
  api.versionsFrom('1.0.3.2');

  api.use([
    'meteor',
    'mongo',
    'templating',
    'reactive-var',
    'underscore',
    'iron:router@1.0.7',
    'rajit:bootstrap3-datepicker@1.4.1',
    'numeral:numeral@1.5.3',
    'percolate:synced-cron@1.2.1',
    'wisptools:collection',
    'wisptools:menu',
    'wisptools:powercode',
    'wisptools:tab-page',
    'wisptools:delete-btn',
    'wisptools:growl',
    'wisptools:download-csv',
    'wisptools:date-format',
    'wisptools:progress-bar'
  ]);

  // Client and Server files
  api.addFiles([
    'lib/collection.js',
    'lib/router.js'
    ], ['server','client']);

  // Client only files
  api.addFiles([
    'client/menu.js',
    'client/templates/main.html',
    'client/templates/main.js',
    'client/templates/reports.html',
    'client/templates/reports.js',
    'client/templates/services.html',
    'client/templates/services.js',
    'client/templates/types.html',
    'client/templates/types.js',
    'client/templates/users.html',
    'client/templates/users.js'
    ], 'client');

 api.addFiles([
    'server/cron.js'
    ], ['server']);

  api.export('WtPowercodeCommission');

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:powercode-commission');
  api.addFiles('wisptools:powercode-commission-tests.js');
});
