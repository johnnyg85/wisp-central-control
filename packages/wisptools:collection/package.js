Package.describe({
  name: 'wisptools:collection',
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
    'meteorhacks:subs-manager@1.6.2',
    'matb33:collection-hooks@0.8.1'
  ]);
  
  api.addFiles('wisptools:collection.js');

  api.export('WtCollection');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wisptools:collection');
  api.addFiles('wisptools:collection-tests.js');
});
