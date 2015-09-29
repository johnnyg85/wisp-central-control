Template.mdShipping.helpers({
    qrCode: function() {
        return qrScanner.message();
    },
    lastScanned: function() {
        return Session.get('lastScanned');
    },
    scannedArchives: function() {
        return Session.get('scannedArchives');
    },
    jsCount: function(data) {
        return data.length;
    },
    diskCountKnown: function(disks) {
        return disks !== 'Unknown';
    },
    scannedDisks: function(count, disks) {
        var res = new Array();
        for (var i=0;i<count;i++) {
            res.push({index: i+1, status:disks.indexOf(i.toString())<0?0:1});
        }
        return res;
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
                        
                        var scannedArchives = Session.get('scannedArchives');
                        var found = 0;
                        if (!scannedArchives) {
                            scannedArchives = new Array();
                        }
                        for (i in scannedArchives) {
                            if (scannedArchives[i].archive && scannedArchives[i].archive._id == res._id) {
                                found = 1;
                                if (scannedArchives[i].disks.indexOf(qrdata.n)<0) {
                                    scannedArchives[i].disks.push(qrdata.n);
                                }
                                break;
                            }
                        }
                        if (!found) {
                            scannedArchives.push({
                                archive: res,
                                disks: [qrdata.n]
                            });
                        }
                        Session.set('scannedArchives', scannedArchives);
                        /*if (!scannedArchives.res_id) {
                            scannedArchives.res_id = new Array();
                        }
                        scannedArchives.res_id['archive'] = res;
                        if (!scannedArchives.res_id['disks']) {
                            scannedArchives.res_id['disks'] = new Array();
                        }
                        scannedArchives.res_id['disks'].push(qrdata.n);
                        console.log(scannedArchives);
                        */
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
    
    new Audio('click.mp3').play();
};