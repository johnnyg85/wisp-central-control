Template.mdShippingInfoBarcode.helpers({
    rawBarcodeData: function() {
        return Session.get('mdShippingRawBarcodeData');
    },
    lastShippingScanned: function() {
        return Session.get('lastShippingScanned');
    }
});

Template.mdShippingInfoBarcode.onRendered(function() {
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
        Session.set('mdShippingRawBarcodeData', code);
        if (code != lastScanned) {
            var USPSBarcodeData = parseUSPSBarcode(code);
            if (USPSBarcodeData) {
                if (USPSBarcodeData.RAI == '420') {
                    lastScanned = code;
                    Meteor.call("getArchiveByTrackingId", USPSBarcodeData.trackingNumber, function (err, res) {
                        if (!err && res) {
                            scanIndications();
                            Session.set('lastShippingScanned', res);
                        } else {
                            scanError();
                        }
                    });
                } else {
                    scanError();
                }
            } else {
                scanError();
            }
        }
    });
});

Template.mdShippingInfoBarcode.onDestroyed(function() {
    Quagga.stop();
    Session.set('lastShippingScanned', false);
    Session.set('mdShippingRawBarcodeData', false);
});

Template.mdShippingInfoBarcodeDetail.helpers({
    addOne: function(num) {
        return parseInt(num, 10)+1;
    }
});