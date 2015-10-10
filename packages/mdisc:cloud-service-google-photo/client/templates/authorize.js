
Template.mdCloudGoogleAuthorizeNavButton.events({
  'click #authorizeGooglePhoto': function(e, t) {
    e.preventDefault();

    Google.requestCredential({
      requestPermissions: ['https://picasaweb.google.com/data/'],
      requestOfflineToken: 'true'
    }, function (credentialToken) {
      //console.log(credentialToken);
      var credentialSecret = OAuth._retrieveCredentialSecret(credentialToken);
      if (credentialToken && credentialSecret) {
        Meteor.call('addCredential', 'Google Photos', credentialToken, credentialSecret);
        Meteor.call('updateRecentPhotos', 'Google Photos');
        // Open and init the Auto Archive
        Meteor.call('openAutoCloudArchive', 'Google Photos', function (err, archiveId) {
          //console.log(archiveId);
          Session.set('openArchiveId', archiveId);
          Meteor.call('initAutoCloudArchive', 'Google Photos', archiveId);
        });

        // Start the timer for displaying some photos
        Session.set('googleConnecting', true);
        Router.go('mdCloudGoogleStartArchive');
        Meteor.setTimeout(function () {
          Session.set('googleConnecting', false);
          Session.set('googleConnected', true);
        }, 5000);
      }
    });
  }
});

Template.mdCloudGoogleStartArchive.helpers({
  googleConnected: function () { return Session.get('googleConnected'); },
  googleConnecting: function () { return Session.get('googleConnecting'); },
  showOrderForm: function() {
    if (Session.get('googleConnected') || Session.get('googleConnecting')) {
      return true;
    }
    return false;
  }
});

Template.mdCloudGoogleStartArchive.onCreated(function () {
  if (Session.get('googleConnecting')) {
    Session.set('googleConnected', false);
  }
});