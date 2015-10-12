Package.describe({
    name: 'mdisc:dates',
    version: '0.0.1',
    summary: 'Meteor package that handle operations involving dates.',
    git: '',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.3');
    api.use([
        'steeve:moment-dateformat@0.0.1'
    ]);
    api.export('MdDates');
    
    api.addFiles([
        'lib/dates.js'
    ], ['server', 'client']);
});

