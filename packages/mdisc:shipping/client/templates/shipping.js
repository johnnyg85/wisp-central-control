Template.mdShipping.helpers({
    qrCode: function() {
        return qrScanner.message();
    },
    lastScanned: function() {
        return Session.get('lastScanned');
    },
    getArchives: function() {
        
    }
});

var lastScanned = "";
qrScanner.on('scan', function(err, result) {
    if (!err) {
        result = processScannedData(result);
        if (result != lastScanned) {
            scanIndications();
            lastScanned = result;
            var qrdata = JSON.parse(result);
            if (qrdata) {
                Meteor.call("getArchiveById", qrdata.id, function(err, res) {
                    if (!err) {
                        Session.set('lastScanned', {archive: res, disc: qrdata.n});
                    }
                });
                Meteor.call("appendToArchiveScanned", qrdata.id, qrdata.n, function(err, res) {
                    
                });
            }
        }
    }
});

var processScannedData = function(data) {
    data = data.replace(/\'/g, '"'); //In JSON only escaped double-quote characters are allowed, not single-quotes.
    data = data.replace(/\\/g, '');
    return data;
};

var scanIndications = function() {
    $('.scanArea').css('background-color', '#DFF0D8');
    setTimeout(function() {
        $('.scanArea').css('background-color', '#FFFFFF');
    }, 250);
    
    /*
     * Play camera clicking sound.
     */
};