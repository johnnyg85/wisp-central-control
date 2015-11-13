Package.describe({
  name: 'mdisc:accounts',
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
    'underscore',
    'accounts-base@1.2.0',
    'accounts-password@1.1.1',
    'accounts-google@1.0.4',
    'useraccounts:bootstrap@1.12.3',
    'useraccounts:iron-routing@1.12.3',
    'softwarerero:accounts-t9n@1.1.4',
    'service-configuration'
    //,'splendido:accounts-meld@1.3.1'
  ]);

  api.addFiles([
    'lib/config/accounts_t9n.js',
    'lib/config/at_config.js',
    'lib/router.js' //important that this loads after at_config.js
    ], ['server','client']);

  //Server Only Files
  api.addFiles([
    'server/config/service_configuration.js',
    'server/functions.js'
    //,'server/config/accounts_meld.js'
    ], ['server']);

  //Client Only Files
  api.addFiles([
    'client/templates/modal.html',
    'client/templates/modal.js',
    'client/templates/at_bootstrap.css'
    ], ['client']);

  api.export('Accounts');
  api.export('MdAccounts', 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mdisc:accounts');
  api.addFiles('accounts-tests.js');
});
