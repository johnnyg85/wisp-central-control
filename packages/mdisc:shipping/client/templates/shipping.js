Template.mdShipping.helpers({
    qrCode: function() {
        return qrScanner.message();
    },
    lastScanned: function() {
        var qrdata;
        if (qrScanner.message()) {
            qrdata = JSON.parse(processScannedData(qrScanner.message()));
            if (qrdata) {
                var record = MdArchive.collection.findOne({"_id": qrdata.id});
                if (record) {
                    return {"archive": record, "disc": qrdata.n};
                }
            }
        }
    },
    getArchives: function() {
        return MdArchive.collection.find();
    }
});

var lastScanned = "";
qrScanner.on('scan', function(err, result) {
    if (!err) {
        result = processScannedData(result);
        if (result != lastScanned) {
            lastScanned = result;
            var qrdata = JSON.parse(result);
            if (qrdata) {
                console.log(qrdata.id);
                console.log(qrdata.n);
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