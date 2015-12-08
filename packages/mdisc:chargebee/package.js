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
    'mdisc:dates',
    'mdisc:aes'
  ]);
  
  api.export('ChargeBeeAPI');
  api.export('MdChargeBee');

  api.addFiles([
    'lib/collections.js',
    'lib/router.js'
  ], ['server', 'client']);
  
  api.addFiles([
    'client/templates/already-have.html',
    'client/functions.js'
  ], 'client');

  api.addFiles([
    'server/chargebee.js',
    'server/publish.js',
    'server/methods.js'
  ], 'server');

});