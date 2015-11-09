Router.route('/account/', {
  name: 'mdMyAccount', 
  template: 'mdMyAccount',
  onBeforeAction: function () {
    if (Session.get('afterLoginDoArchive')) {
      Session.set('afterLoginDoArchive', false); // clear session var
      // render connect page
      Router.go('mdCloudGoogleConnectAccount');
    } else {
      this.next();
    }
  }
});
