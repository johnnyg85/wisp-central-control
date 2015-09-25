Package.describe({
  name: 'mdisc:mandrill',
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
  api.versionsFrom('1.1.0.3');

  api.use([
    'templating',
    'iron:router@1.0.9',
    'wylio:mandrill@1.0.1',
    'mdisc:accounts',
    'wisptools:menu'
  ]);    

  // Client Files
  api.addFiles([
    'client/templates/test.html',
    'client/templates/test.js',
    'client/menu.js'
  ],['client']);

  // Client and Server Files
  api.addFiles([
    'lib/routes.js'
  ],['client','server']);

  // Server Files
  api.addFiles([
    'server/mandrill.js',
    'server/methods.js'
  ],['server']);


});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mdisc:mandrill');
  api.addFiles('mandrill-tests.js');
});
