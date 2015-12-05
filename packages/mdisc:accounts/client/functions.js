MdAccounts = {
  signIn: function (redirectUrl) {
    Meteor.loginWithGoogle({
      // Must include Google Photos access everytime, or else it is dropped on subsequent logins.
      requestPermissions: ['https://picasaweb.google.com/data/'],
      requestOfflineToken: 'true',
      loginStyle: 'redirect', 
      redirectUrl: redirectUrl
    });
  }
};
