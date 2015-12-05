// Server side only methods
Meteor.methods({
  sendEmail: function (template, email) {
    Mandrill.messages.sendTemplate({
      template_name: template,
      template_content: [],
      message: {
        to: [{email: email}],
        global_merge_vars: [
          {
            name: 'firstname',
            content: 'TEST'
          }
        ]
      }
    }, function (err, res) {
      console.log(err);
    });
  },
  sendWelcomeEmail: function () {
    if (!Meteor.userId()) {
      // user not logged in.
      return null;
    }

    var firstname = Meteor.call('getFirstname');
    var email = Meteor.call('getEmail');

    Mandrill.messages.sendTemplate({
      template_name: 'new-account',
      template_content: [],
      message: {
        to: [{email: email}],
        global_merge_vars: [
          {
            name: 'firstname',
            content: firstname
          }
        ]
      }
    }, function (err, res) {
      console.log(err);
    });

  }
});
