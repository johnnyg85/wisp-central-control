ImgToPdf = {};

ImgToPdf.print = function (imgURL, callback) {
    // create a document and pipe to a blob
    var doc = new pdfKit({size: [400, 600], margin: 0});
    var stream = doc.pipe(blobStream());
    
    var img = document.createElement("img");
    img.hidden = true;
    img.id = 'pdfImage';
    //remove any existing pdfImage and append new.
    if (document.getElementById(img.id)) {
        document.getElementsByTagName('body')[0].removeChild(document.getElementById(img.id));
    }
    document.getElementsByTagName('body')[0].appendChild(img);
    
    var iframe = document.createElement("iframe");
    iframe.hidden = true;
    iframe.id = 'pdfFrame';
    //remove any existing pdfFrame and append new.
    if (document.getElementById(iframe.id)) {
        document.getElementsByTagName('body')[0].removeChild(document.getElementById(iframe.id));
    }
    document.getElementsByTagName('body')[0].appendChild(iframe);
    
    var canvas = document.createElement("canvas");
    canvas.hidden = true;
    canvas.id = 'pdfCanvas';
    //remove any existing pdfCanvas and append new.
    if (document.getElementById(canvas.id)) {
        document.getElementsByTagName('body')[0].removeChild(document.getElementById(canvas.id));
    }
    document.getElementsByTagName('body')[0].appendChild(canvas);
    
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        doc.image(canvas.toDataURL(), 0, 0, {width: 400, hieght: 600});
        doc.end();
    };
    img.src = imgURL;
    
    stream.on('finish', function () {
        document.getElementById('pdfFrame').onload = function () {
            document.getElementById('pdfFrame').contentWindow.print();
            callback();
        };
        document.getElementById('pdfFrame').src = stream.toBlobURL('application/pdf');
    });
};
