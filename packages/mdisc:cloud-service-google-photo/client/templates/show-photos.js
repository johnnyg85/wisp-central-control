Template.mdCloudGoogleShowPhotos.helpers({
  urls: function () {
    var data = [];
    var urls = Session.get('recentUrls');
    if (!urls) return [];
    var len = urls.length;
    var numPhotos = 10;
    for (var y=0; y<numPhotos; y++) {
      var rnd = Math.floor((Math.random() * len));
      data.push({url: urls[rnd]});
    }
    return data;
  }
});

Template.mdCloudGoogleShowPhotos.events({
  'click #mdCloudGoogleContinue': function (e, t) {
    e.preventDefault();
    Session.set('cloudConnectingStep', 3); // update menu to next step
    Router.go('mdCloudGoogleFinalizeOrder');
  }
})