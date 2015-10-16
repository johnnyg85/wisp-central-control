Template.mdShippingInfoQR.helpers({
    qrCode: function() {
        return processScannedData(qrScanner.message());
    },
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
                try {
                    var qrdata = JSON.parse(result);
                } catch (e) {
                    //Do nothing
                }
                if (qrdata) {
                    Meteor.call("getArchiveById", qrdata.id, function(err, res) {
                        if (!err && res) {
                           Session.set('lastShippingScanned', res);
                        } else {
                            scanError();
                        }
                    });
                } else {
                    scanError();
                }
            }
        }
    });
});

Template.mdShippingInfoQR.onDestroyed(function() {
    Session.set('lastShippingScanned', false);
});

Template.mdShippingInfoQRDetail.helpers({
    addOne: function(num) {
        return parseInt(num, 10)+1;
    }
});
