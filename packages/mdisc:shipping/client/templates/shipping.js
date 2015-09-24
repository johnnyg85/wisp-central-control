Template.mdShipping.helpers({
    qrCode: function() {
        return qrScanner.message();
    },
    lastScanned: function() {
        var qrdata;
        if (qrScanner.message()) {
            qrdata = JSON.parse(qrScanner.message());
            if (qrdata) {
                var record = MdShippingPage.archives.findOne({"_id": qrdata.id});
                if (record) {
                    return {"archive": record, "disc": qrdata.n};
                }
            }
        }
    }
});

qrScanner.on('scan', function(err, result) {
    if (!err) {
        //Update collection
    }
});