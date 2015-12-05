MdAccounts = {
  signIn: function (redirectUrl) {
    Meteor.loginWithGoogle({
      loginStyle: 'redirect', 
      redirectUrl: redirectUrl
    });
  }
};