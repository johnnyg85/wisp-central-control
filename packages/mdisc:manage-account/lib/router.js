Router.route('/account/', {
  name: 'mdMyAccount', 
  template: 'mdMyAccount',
  onBeforeAction: function () {
    if (Session.get('afterLoginDoArchive')) {
      Session.set('afterLoginDoArchive', false); // clear session var

      // Simulate clicking the archive now button
      var e = $.Event('click');
      $('#authorizeGooglePhoto').trigger(e);

      // render home
      this.render('home');
    } else {
      this.next();
    }
  }
});