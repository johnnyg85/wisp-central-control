googlePhotos = [];

googlePhotos.requestCredential = function (redirectUrl) {
  Meteor.loginWithGoogle({
    requestPermissions: ['https://picasaweb.google.com/data/'],
    requestOfflineToken: 'true',
    loginStyle: 'redirect',
    redirectUrl: redirectUrl
  });
};
