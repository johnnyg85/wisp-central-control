Template.mdMandrillTest.events({
  'click a#btn-new-account': function(e, t) {
    e.preventDefault();

    var email = document.getElementById('email').value;
    if (email != '') {
      Meteor.call('sendEmail','new-account',email);
      console.log('new-account email sent');
    } else {
      console.log('email address not set');
    }
  }
});
