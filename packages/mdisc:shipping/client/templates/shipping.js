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
    scannedDisks: function(count, scanned) {
        var res = new Array();
        for (var i=0;i<count;i++) {
            var index = i+1;
            var status = 0;
            var time;
            for (j in scanned) {
                if (scanned[j].diskIndex == i) {
                    status = 1;
                    time = scanned[j].time;
                }
            }
            res.push({index: index, status: status, time: time});
        }
        return res;
    },
    scanCompleted: function(count, disks) {
        return count === disks.length;
    },
    formatDate: function (timestamp) {
        var d = new Date(timestamp);
        return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    }
});

Template.mdShipping.events({
    'click .print_shipping_label': function() {
        var label_url = "http://assets.geteasypost.com/postage_labels/labels/0jvZJy.png";
        Meteor.call("setArchiveStatus", "Shipped", this._id);
        Meteor.call("setShippingLabel", label_url, this._id);
        
        var scannedArchives = Session.get('scannedArchives');
        if (scannedArchives) {
            for (i in scannedArchives) {
                if (scannedArchives[i] && scannedArchives[i]._id == this._id) {
                    scannedArchives[i].status = "Shipped";
                    Session.set('scannedArchives', scannedArchives);
                    break;
                }
            }
        }
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
                        
                        var already_scanned = 0;
                        if (res.scanned && res.scanned.length>0) {
                            for (i in res.scanned) {
                                if (res.scanned[i].diskIndex == qrdata.n) {
                                    already_scanned = 1;
                                    alert('This disk was scanned earlier.');
                                }
                            }
                        }
                        if (!already_scanned) {
                            Meteor.call("appendToArchiveScanned", qrdata.id, qrdata.n);
                        }
                        
                        var scannedArchives = Session.get('scannedArchives');
                        var found = 0;
                        if (!scannedArchives) {
                            scannedArchives = new Array();
                        }
                        for (i in scannedArchives) {
                            if (scannedArchives[i] && scannedArchives[i]._id == res._id) {
                                found = 1;
                                scannedArchives[i] = res;
                                break;
                            }
                        }
                        if (!found) {
                            scannedArchives.push(res);
                        }
                        Session.set('scannedArchives', scannedArchives);
                    }
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