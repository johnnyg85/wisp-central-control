Template.mdCloudServiceShowFewPhotos.helpers({
  urls: function () {
    var data = [];
    var urls = Session.get('recentUrls');
    var len = urls.length;
    for (var x=0; x<len; x++) {
      data.push({url: urls[x]});
    }
    return data;
  }
});
