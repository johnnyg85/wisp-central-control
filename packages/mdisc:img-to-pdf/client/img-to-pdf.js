imgToPdf = {};

imgToPdf.print = function (imgURL) {
    /*
     * Add Code that downloads image from imgURL to current server and provide a link to it
     * 
     */
    
    
    // create a document and pipe to a blob
    var doc = new pdfKit({size: [400, 600], margin: 0});
    var stream = doc.pipe(blobStream());
    
    var img = document.createElement("img");
    var iframe = document.createElement("iframe");
    iframe.hidden = true;
    iframe.id = 'pdfFrame';
    //remove any existing frame and append new.
    if (document.getElementById('pdfFrame')) {
        document.getElementsByTagName('body')[0].removeChild(document.getElementById('pdfFrame'));
    }
    document.getElementsByTagName('body')[0].appendChild(iframe);
    
    img.src = imgURL;
    
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    
    doc.image(canvas.toDataURL(), 0, 0, {width: 400, hieght: 600});
    
    // end and display the document in the iframe to the right
    doc.end();
    
    stream.on('finish', function () {
        document.getElementById('pdfFrame').src = stream.toBlobURL('application/pdf');
        setTimeout(function () {
            document.getElementById('pdfFrame').contentWindow.print();
        }, 2000);
    });
};
