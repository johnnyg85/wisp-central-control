Meteor.methods({
    mdDownloadTempFile: function (url) {
        download();
        return true;
    },
    mdDeleteTempFile: function (url) {
        
    }
});

var http = Npm.require('http');
var fs = Npm.require('fs');

var download = function () {
    var file = fs.createWriteStream("file.jpg");
    var request = http.get("http://assets.geteasypost.com/postage_labels/labels/0jvZJy.png", function(response) {
      response.pipe(file);
    });
};