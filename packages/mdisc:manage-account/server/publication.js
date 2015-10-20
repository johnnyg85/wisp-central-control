Meteor.publish('userlog', function (id) {
    
  return Meteor.users.find({_id:id});

});