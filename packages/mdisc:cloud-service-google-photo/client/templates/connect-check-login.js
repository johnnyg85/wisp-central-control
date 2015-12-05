Template.mdCloudGoogleConnectCheckLogin.onRendered(function () {
  Session.set('isCloudConnecting', true); // turn on steps menu
  Session.set('cloudConnectingStep', 1);  // set menu on first step

  if (!Meteor.userId() && !Meteor.loggingIn()) {
    var url = Router.url('mdCloudGoogleConnectCheckLogin');
    MdAccounts.signIn(url);
    return; // Don't continue until user is logged in
  }

  checkGoogleCredentials();

});

var checkGoogleCredentials = function () {
  if (Meteor.loggingIn()) {
    // check back later
    Meteor.setTimeout(function () {
      checkGoogleCredentials();
    }, 500);
    return; // don't continue, until fully logged in.
  }
  
  // Check if user already has subscription
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
      // Get Google Photos creditentials.
      var url = Router.url('mdCloudGoogleConnectCheckToken');
      MdCloudServices.askCredential('Google Photos', url);        
    }
  });
};

