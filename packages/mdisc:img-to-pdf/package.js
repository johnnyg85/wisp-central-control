Package.describe({
    name: 'mdisc:img-to-pdf',
    version: '0.0.1',
    summary: 'Meteor package for converting image to PDF.',
    git: '',
    documentation: 'README.md'
});

Npm.depends({
    'brfs': '1.4.1',
    'pdfkit':'0.7.1',
    'blob-stream':'0.1.3'
});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.3');
    
    api.use([
        'cosmos:browserify@0.7.0'
    ], 'client');
    
    api.export('imgToPdf');
    
    api.addFiles([
        'client.browserify.js',
        'client/img-to-pdf.js'
    ], 'client');
    
    api.addFiles([
        'server/methods.js'
    ], 'server');
    
});
