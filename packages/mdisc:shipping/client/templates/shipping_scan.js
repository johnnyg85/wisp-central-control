Template.mdShippingScan.helpers({
    
});

Template.mdShippingScan.onRendered(function() {
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
            scanIndications();
            lastScanned = code;
            
            console.log(code);
        }
    });
});

var scanIndications = function() {
    $('.scanArea').css('background-color', '#DFF0D8');
    setTimeout(function() {
        $('.scanArea').css('background-color', '#FFFFFF');
    }, 250);
    
    new Audio('click.mp3').play();
};
