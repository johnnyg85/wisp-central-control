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
    Router.go('mdCloudGoogleConnectCheckLogin');
  }
});


Template.mdCloudGoogleConnectAccountStart.events({
  'click #startGooglePhoto': function(e, t) {
    e.preventDefault();
    Router.go('mdCloudGoogleConnectAccount');
  }
});

