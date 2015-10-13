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
