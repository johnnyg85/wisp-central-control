Template.mdCloudServiceShowFewPhotos.helpers({
  urls: function () {
    var data = [];
    var doc = MdCloudServices.recentPhotos.findOne({owner: Meteor.userId()});
    var len = doc.urls.length;
    for (var x=0; x<len; x++) {
      data.push({url: doc.urls[x]});
    }
    return data;
  }
});
