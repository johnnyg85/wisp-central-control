
Template.wtRolesUser.created = function(){
  var self = this;
  Meteor.subscribe('admin');
  self.userList = new ReactiveVar([]);
  var data =Meteor.users.find();
  var count = Meteor.users.find().count();
  self.userList.set(data);
}

Template.wtRolesUser.helpers({
  userList: function(){ 
    return Template.instance().userList.get();
  }
});

Template.wtRolesUsersSelect.created = function(){
  var sel=this;
  sel.typeList= new ReactiveVar([]);
}

Template.wtRolesUsersSelect.helpers({
  userType: function () {
     
    var User = Template.parentData(1);
    var _id=User._id
    
    Meteor.subscribe('user',User._id);
    var data = Meteor.users.findOne({_id: User._id});
    if (data == undefined) {
  
      data = {
        _id: User._id,
        username: User.username,
        name: User.roles
      }
       
    }
  
    return data;
  },
  typeList: function () {
    Meteor.subscribe('roles');
    return Meteor.roles.find();  
  },
  selected: function (a, b) {
    return a == b ? 'selected' : '';
  }
});

Template.wtRolesUsersSelect.events({
  "change .type-sel": function (event) {
    var User = Template.parentData(0);
    var name;
    var roles=event.target.value;

    var data = {
      id: User._id,
      roles: event.target.value
    }

    var user=Meteor.user();
    if(user._id==User._id) {
      WtGrowl.fail("Sorry!! you cannot update your own role ");
    } else {
      Meteor.call('updateRoles',data.id,data.roles,function (err, res) {
        if (err)
          WtGrowl.fail("Could not update Role type for user " + data.name);
        else {
          WtGrowl.success("Role type updated for user " + data.name);
        }
      });
    }
  }
});

