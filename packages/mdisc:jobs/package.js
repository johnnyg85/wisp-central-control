Package.describe({
  name: 'mdisc:jobs',
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
    'iron:router@1.0.7',
    'wisptools:menu',
    'wisptools:collection',
    'wisptools:roles',
    'vsivsi:job-collection@1.2.3'
  ]);    

  api.addFiles([
    'client/templates/admin-view.html',
    'client/templates/admin-view.js',
    'client/menu.js',
    ], ['client']);

  api.addFiles([
    'lib/jobs.js',
    'lib/router.js'
    ], ['server','client']);
  
  api.export('Jobs');
  api.export('JobCollection');
  api.export('MdJobs');

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('mdisc:jobs');
  api.addFiles('jobs-tests.js');
});
