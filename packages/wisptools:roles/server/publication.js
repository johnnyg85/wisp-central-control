Meteor.publish('admin', function () {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
     
    return Meteor.users.find({});

  } else {

    // user not authorized. do not publish secrets
    this.stop();
    return;

  }
});

Meteor.publish('roles', function () {
  if (Roles.userIsInRole(this.userId, ['admin'])) {

    return Meteor.roles.find({});

  } else {

    // user not authorized. do not publish secrets
    this.stop();
    return;

  }
});


Meteor.publish('user', function (id) {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
      
     return Meteor.users.find({_id:id});
  } else {

    // user not authorized. do not publish secrets
    this.stop();
    return;

  }
});
