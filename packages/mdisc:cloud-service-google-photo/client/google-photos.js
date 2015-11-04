googlePhotos = [];

googlePhotos.requestCredential = function () {
  Google.requestCredential({
    requestPermissions: ['https://picasaweb.google.com/data/'],
    requestOfflineToken: 'true'
  }, function (credentialToken) {
    var credentialSecret = OAuth._retrieveCredentialSecret(credentialToken);
    if (credentialToken && credentialSecret) {
      Meteor.call('addCredential', 'Google Photos', credentialToken, credentialSecret);
    }
  });
};