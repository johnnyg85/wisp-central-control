Package.describe({
  name: 'mdisc:chargebee',
  version: '0.0.1',
  summary: 'Meteor package for ChargeBee.',
  git: '',
  documentation: 'README.md'
});

Npm.depends({"chargebee": "1.2.9"});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');
  api.use([
    'templating',
    'iron:router@1.0.7',
    'mongo',
    'wisptools:collection',
    'wisptools:growl',
    'mdisc:address-ui',
    'mdisc:dates'
  ]);
  
  api.export('ChargeBeeMeteor');
  api.export('MdChargeBeeMeteor');
  
  api.addFiles([
    'client/subscriptions.js'
  ], 'client');

  api.addFiles([
    'server/chargebee.js',
    'server/publish.js',
    'server/methods.js'
  ], 'server');

  api.addFiles([
    'lib/collections.js'
  ], ['server', 'client']);
});