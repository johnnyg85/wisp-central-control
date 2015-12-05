Template.mdCloudGoogleConnectCheckToken.onRendered(function () {
  Session.set('isCloudConnecting', true); // turn on steps menu
  Session.set('cloudConnectingStep', 1);  // set menu on first step

  // Simulate some connecting time
  Session.set('mdCloudAuhenticating', true);
  Meteor.setTimeout(function () {
    // Pull recent photos
    Meteor.call('getRecentPhotos', 'Google Photos', function (err, res) {
      if (err) {
        WtGrowl.fail("There is a problem authenticating with Google Photos");
        Router.go('mdCloudGoogleConnectAccount');
        return;
      }
      if (res.length == 0) {
        Session.set('mdCloudAuhenticating', false);
        Router.go('mdCloudGoogleNoPhotos');
        return;
      }
      Session.set('recentUrls', res);
      Session.set('mdCloudAuhenticating', false);
      Session.set('cloudConnectingStep', 2); // update menu to next step
      Router.go('mdCloudGoogleShowPhotos');
    });
  }, 2500);

});