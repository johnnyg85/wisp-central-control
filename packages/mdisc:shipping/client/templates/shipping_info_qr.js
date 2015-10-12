Template.mdShippingInfoQR.helpers({
    lastShippingScanned: function() {
        return Session.get('lastShippingScanned');
    }
});

Template.mdShippingInfoQR.onRendered(function() {
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
                        if (!err && res) {
                           Session.set('lastShippingScanned', res);
                        }
                    });
                }
            }
        }
    });
});

Template.mdShippingInfoQR.onDestroyed(function() {
    Session.set('lastShippingScanned', false);
});

var scanIndications = function() {
    $('.scanArea').css('background-color', '#DFF0D8');
    setTimeout(function() {
        $('.scanArea').css('background-color', '#FFFFFF');
    }, 250);
    
    new Audio('scanner-beep.mp3').play();
};

var processScannedData = function(data) {
    data = data.replace(/\'/g, '"'); //In JSON only escaped double-quote characters are allowed, not single-quotes.
    data = data.replace(/\\/g, '');
    return data;
};