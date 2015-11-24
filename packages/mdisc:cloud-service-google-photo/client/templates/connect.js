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
      Meteor.call('mdCloudServiceIsConnected', 'Google Photos', function (err, res) {
        if (err) {
          console.log(err);
          WtGrowl.fail("There is a problem accessing Google Photos");
          return;
        }

        // Pull recent photos
        Meteor.call('getRecentPhotos', 'Google Photos', function (err, res) {
          Session.set('recentUrls', res);
        });
        
        /*
        // Open and init the Auto Archive
        Meteor.call('openAutoCloudArchive', 'Google Photos', function (err, archiveId) {
          //console.log(archiveId);
          Session.set('openArchiveId', archiveId);
          Meteor.call('initAutoCloudArchive', 'Google Photos', archiveId, function (err, res) {
          });
        });
        */

        // Simulate some connecting time
        Session.set('mdCloudAuhenticating', true);
        Meteor.setTimeout(function () {
          Session.set('mdCloudAuhenticating', false);
          Session.set('cloudConnectingStep', 2); // update menu to next step
          Router.go('mdCloudGoogleShowPhotos');
        }, 3500);
      });
    });
  }
});


Template.mdCloudGoogleConnectAccountStart.events({
  'click #startGooglePhoto': function(e, t) {
    e.preventDefault();

    if (!Meteor.userId()) {
      // User not logged in.
      Session.set('afterLoginDoArchive', true);
      $('#atFormModal').modal('show'); 
      return;     
    }
    
    Meteor.call('mdChargeBeeListSubscriptions', function (err, res) {
      if (err) {
        WtGrowl.fail("An error has occurred. Please try again later.");
        return;
      }
      var hasActiveSubscription = false;
      if (res && res.length>0) {
        for (var i=0; i<res.length; i++) {
          if (res[i].subscription.status && res[i].subscription.status == 'active') {
            hasActiveSubscription = true;
          }
        }
      }
      if (hasActiveSubscription) {
        Router.go('mdChargeBeeCheckSubscription');
      } else {
        Router.go('mdCloudGoogleConnectAccount');
      }
    });
  }
});

