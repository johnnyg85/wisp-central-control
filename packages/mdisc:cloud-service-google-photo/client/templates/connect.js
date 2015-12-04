Template.mdCloudGoogleConnectAccount.onRendered(function () {
  Session.set('isCloudConnecting', true); // turn on steps menu
  Session.set('cloudConnectingStep', 1);  // set menu on first step
});

Template.mdCloudGoogleConnectAccount.helpers({
  showAuthenticating: function () {
    if (Session.get('mdCloudAuhenticating')) {
      return true;
    } else {
      return false;
    }
  }
});

Template.mdCloudGoogleConnectAccount.events({
  'click #authorizeGooglePhotoAccount': function(e, t) {
    e.preventDefault();

    MdCloudServices.getCredential('Google Photos', false, function (err, res) {
      if (err) {
        console.log(err);
        WtGrowl.fail("There is a problem authenticating with Google Photos");
        return;
      }

      // Simulate some connecting time
      Session.set('mdCloudAuhenticating', true);
      Meteor.setTimeout(function () {
        // Pull recent photos
        Meteor.call('getRecentPhotos', 'Google Photos', function (err, res) {
          if (err || res.length == 0) {
            Session.set('mdCloudAuhenticating', false);
            Router.go('mdCloudGoogleNoPhotos');
            return;
          }
          Session.set('recentUrls', res);
          Session.set('mdCloudAuhenticating', false);
          Session.set('cloudConnectingStep', 2); // update menu to next step
          Router.go('mdCloudGoogleShowPhotos');
        });
      }, 3500);

    });
  }
});


Template.mdCloudGoogleConnectAccountStart.events({
  'click #startGooglePhoto': function(e, t) {
    e.preventDefault();
    Router.go('mdCloudGoogleConnectAccount');
  }
});

