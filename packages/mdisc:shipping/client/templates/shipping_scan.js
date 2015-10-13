Template.mdShippingScan.helpers({
    lastShippingScanned: function() {
        return Session.get('lastShippingScanned');
    }
});

Template.mdShippingScan.onRendered(function() {
    var config = getQuaggaScannerConfig();
    Quagga.init(config, function (err) {
        Quagga.start();
    });
    Quagga.onProcessed(function (result) {
        var drawingCtx = Quagga.canvas.ctx.overlay;
        var drawingCanvas = Quagga.canvas.dom.overlay;
        
        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                });
            }
            
            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
            }
            
            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
            }
        }
    });
    var lastScanned = "";
    Quagga.onDetected(function (result) {
        var code = result.codeResult.code;
        if (code != lastScanned) {
            var USPSBarcodeData = parseUSPSBarcode(code);
            if (USPSBarcodeData) {
                if (USPSBarcodeData.RAI == '420') {
                    scanIndications();
                    lastScanned = code;
                    Meteor.call("getArchiveByTrackingId", USPSBarcodeData.trackingNumber, function (err, res) {
                        if (!err && res) {
                            Session.set('lastShippingScanned', res);
                            Meteor.call("setArchiveStatus", "Shipped", res._id, function(err) {
                                if (!err) {
                                    var lastScanned = Session.get('lastShippingScanned');
                                    if (lastScanned) {
                                        lastScanned.status = 'Shipped';
                                        Session.set('lastShippingScanned', lastScanned);
                                    }
                                }
                            });
                            Meteor.call("pushArchiveShippingScanned", res._id, function (err, res) {
                                if (!err && res) {
                                    var lastScanned = Session.get('lastShippingScanned');
                                    if (lastScanned) {
                                        Session.set('lastShippingScanned', res);
                                    }
                                }
                            });
                        }
                    });
                }
            }
        }
    });
});

Template.mdShippingScan.onDestroyed(function() {
    Quagga.stop();
    Session.set('lastShippingScanned', false);
});
