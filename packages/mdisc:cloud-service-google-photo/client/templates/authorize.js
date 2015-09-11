
Template.mdCloudGoogleAuthorizeButtonsBig.events({
  'click a#authorizeGooglePhoto': function(e, t) {
    e.preventDefault();

    Google.requestCredential({
      requestPermissions: ['https://picasaweb.google.com/data/'],
      requestOfflineToken: 'true'
    }, function (credentialToken) {
      console.log(credentialToken);
      var credentialSecret = OAuth._retrieveCredentialSecret(credentialToken);
      if (credentialToken && credentialSecret) {
        Meteor.call("addCredential", 'Google Photos', credentialToken, credentialSecret);
        Meteor.call('updateRecentPhotos', 'Google Photos');
        var archiveId = Meteor.call('openAutoCloudArchive', 'Google Photos');
        Session.set('googleConnecting', true);
        Session.set('openArchiveId', archiveId);
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
});

Template.mdCloudGoogleStartArchive.onCreated(function () {
  Session.set('googleConnected', false);
  Session.set('googleConnecting', false);
});