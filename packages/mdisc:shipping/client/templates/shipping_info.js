Template.mdShippingInfo.helpers({
    lastShippingScanned: function() {
        return Session.get('lastShippingScanned');
    },
    scannerType: function(type) {
        return Session.get('scannerType') === type;
    }
});

Template.mdShippingInfo.events({
    'click .scanSwitchBtn': function() {
        var scannerType = Session.get('scannerType');
        if (scannerType) {
            if (scannerType == 'QR') {
                startQRcodeScanner();
                scannerType = 'Barcode';
            } else {
                startBarcodeScanner();
                scannerType = 'QR';
            }
        } else {
            startBarcodeScanner();
            scannerType = 'QR';
        }
        Session.set('scannerType', scannerType);
    }
});

Template.mdShippingInfo.onRendered(function() {
    var scannerType = Session.get('scannerType');
    if (scannerType && scannerType=='QR') {
        startQRcodeScanner();
    } else {
        startBarcodeScanner();
    }
});

var startQRcodeScanner = function() {
    var lastScanned = "";
    qrScanner.on('scan', function(err, result) {
        console.log('QR scanner running');
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
};

var startBarcodeScanner = function() {
    var config = {
        inputStream: {name: "Live",
            type: "LiveStream",
            constraints: {
                width: 640,
                height: 480,
                facing: "environment"
            },
            area: {// defines rectangle of the detection/localization area 
                top: "0%", // top offset 
                right: "0%", // right offset 
                left: "0%", // left offset 
                bottom: "0%"  // bottom offset 
            },
            singleChannel: false // true: only the red color-channel is read 
        },
        tracking: false,
        debug: false,
        controls: false,
        locate: true,
        numOfWorkers: 4,
        visual: {
            show: true
        },
        decoder: {
            drawBoundingBox: false,
            showFrequency: false,
            drawScanline: true,
            showPattern: false,
            readers: [
                'code_128_reader'
            ]
        },
        locator: {
            halfSample: true,
            patchSize: "medium", // x-small, small, medium, large, x-large 
            showCanvas: false,
            showPatches: false,
            showFoundPatches: false,
            showSkeleton: false,
            showLabels: false,
            showPatchLabels: false,
            showRemainingPatchLabels: false,
            boxFromPatches: {
                showTransformed: false,
                showTransformedBox: false,
                showBB: false
            }
        }
    };
    Quagga.init(config, function (err) {
        Quagga.start();
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
                        }
                    });
                }
            }
        }
    });
};

var scanIndications = function() {
    $('.scanArea').css('background-color', '#DFF0D8');
    setTimeout(function() {
        $('.scanArea').css('background-color', '#FFFFFF');
    }, 250);
    
    new Audio('scanner-beep.mp3').play();
};

var parseUSPSBarcode = function(data) {
    /* Based on http://www.endicia.com/tools-resources/harrys-hints/new-usps-tracking-barcodes
     *
     * RAI : Routing Application Identifier (3 digits)
     * ZIP : ZIP Code (5 digits)
     * CAI : Channel Application Identifier (2 digits)
     * STC : Service Type Code (3 digits)
     * SOI : Source Identifier (2 digits)
     * MID : Mailer ID (6 digits)
     * SLN : Serial Number (8 digits)
     * MCD : MOD 10  Check Digit (1 digit)
     * 
     * trackingNumber : Barcode data excluding RAI and ZIP section (22 digits)
     */
    
    if (data.length != 30) {
        return false;
    }
    if (!Luhn.validate(data)) {
        return false;
    }
    var result = {
        RAI: data.slice(0, 3),
        ZIP: data.slice(3, 8),
        CAI: data.slice(8, 10),
        STC: data.slice(10, 13),
        SOI: data.slice(13, 15),
        MID: data.slice(15, 21),
        SLN: data.slice(21, 29),
        MCD: data.slice(29),
        
        trackingNumber: data.slice(8)
    };
    return result;
};

var processScannedData = function(data) {
    data = data.replace(/\'/g, '"'); //In JSON only escaped double-quote characters are allowed, not single-quotes.
    data = data.replace(/\\/g, '');
    return data;
};