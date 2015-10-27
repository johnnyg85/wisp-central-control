

Template.mdMyAccount.helpers({
  orders: function() {
    return MdArchive.collection.find().fetch();
  },
  user: function() {
    return Meteor.user();
  },
});

Template.mdMyAccountOrder.helpers({
  show: function(status) { 
    if (status == 'Open') {
      return false;
    } else {
      return true;
    }
  },
  shipStatus: function(status) {
    var stats=MdArchive.collection.find().fetch();
      if(stats[0].status=="Shipped") {
        console.log(stats[0].status);
        return true;
      } else {
       return false
      } 
  }
});

Template.mdMyAccountShippingForm.helpers({
  user: function() {
    return Meteor.user();
  }
});

Template.mdMyAccountShippingForm.events({
  'submit': function(e, t) {
    e.preventDefault();

    var archiveId = Session.get('openArchiveId');
    var formData = {};
    var shipTo;

    // Build object of form data
    for (var x = 0; x < e.target.length; x++) {
      if (e.target[x].name) {
        formData[e.target[x].name] = e.target[x].value;
      }
    }

    shipTo = {
      name: formData.name,
      address: formData.address,
      address2: formData.address2,
      city: formData.city,
      state: formData.state,
      zip: formData.zip
    };


    // Update the account address
    Meteor.users.update({_id: Meteor.userId()}, { $set:{"profile.shipTo": shipTo}}, function (err, res) {
      if (err)
        WtGrowl.fail("Could not update Shipping Information");
      else
        WtGrowl.success("Shipping Information updated");
    });

    // Update the first name
    var name = shipTo.name.trim();
    if (name.indexOf(' ') > 0)
      name = name.slice(0, name.indexOf(' '));
    Meteor.users.update({_id: Meteor.userId()}, { $set:{"profile.firstname": name}} )

  },
});

Template.mdMyAccountUserForm.rendered=function()
{
 
  Session.set('pwdsuccess',false);
  Session.set('passmatch',false);
  Session.set('pwdstrength',false);
  Session.set('pwdstrengths',false); 
};

Template.mdMyAccountUserForm.helpers({
  userdet:function()
  {
    Meteor.subscribe('userlog',Meteor.userId());
    var data = Meteor.users.findOne({_id: Meteor.userId()});
    return data;
  },
  showcurrerror:function()
  {    
    return Session.get('showcurr');
  },
  showpwderror:function()
  {    
    return Session.get('passmatch');
  },
  succmessage:function()
  {
    return Session.get('pwdsuccess');
  },
  passwdstrength:function()
  {
    return Session.get('pwdstrength');
  },
  passwdstrengths:function()
  {
    return Session.get('pwdstrengths');
  }
  
});

Template.mdMyAccountUserForm.events({
  'click #btChangePassword':function(event){
     event.preventDefault();
     var password=$('[name=txtNewpassword]').val();
    
     if(($('[name=txtNewpassword]').val()!=$('[name=txtRepassword]').val())
            ||($('[name=txtNewpassword]').val()=='')||($('[name=txtRepassword]').val()=='')) {
        Session.set('passmatch',true);
        Session.set('pwdsuccess',false);
       }
     else if((password.length < 6)||(password.length >20)) {
       Session.set('passmatch',false);
       Session.set('pwdstrength',true);
     }
     else if(!(password.match(/([a-zA-Z])/)) || !(password.match(/([0-9])/))) {
       Session.set('passmatch',false);
       Session.set('pwdstrength',false);
       Session.set('pwdstrengths',true);
     }
     else {
       Session.set('pwdstrengths',false);    
       var email = $('[name=txtEmail]').val();
       var oldPassword = $('[name=txtPassword]').val();
       var newPassword = $('[name=txtNewpassword]').val();
        
       Accounts.changePassword(oldPassword,newPassword, function(err){
         if(err){
           Session.set('showcurr',true);
         }
         else {
           Session.set('showcurr',false);
           Session.set('pwdsuccess',true);
         }
       })
        
     }
  }
 
});