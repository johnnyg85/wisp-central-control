MdAccounts = {
  getFirstname: function () {
    var user = Meteor.user();
    // Logged in?
    if (!user) { return null; }

    var firstname = '';
    if (user.hasOwnProperty('services')) {
      // Google
      if (user.services.hasOwnProperty('google')) {
        firstname = user.services.google.given_name;
      }
    }
    return firstname;

  },
  getEmail: function () {
    var user = Meteor.user();
    // Logged in?
    if (!user) { return null; }

    var email = '';
    // Standard Email
    if (user.hasOwnProperty('email')) {
      email = user.email[0].address;
    }
    if (user.hasOwnProperty('services')) {
      // Google
      if (user.services.hasOwnProperty('google')) {
        email = user.services.google.email;
      }
    }
    return email;

  },
  initAddress: function () {
    
  }
};