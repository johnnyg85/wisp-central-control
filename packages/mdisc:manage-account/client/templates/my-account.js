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

Template.mdMyAccountUserForm.helpers({
  userdet:function()
  {
    Meteor.subscribe('userlog',Meteor.userId());
    var data = Meteor.users.findOne({_id: Meteor.userId()});
    return data;
  }
});

Template.mdMyAccountUserForm.events({
  'click #btChangePassword':function(event){
    event.preventDefault();
    if(($('[name=txtNewpassword]').val()!=$('[name=txtRepassword]').val())
            ||($('[name=txtNewpassword]').val()=='')||($('[name=txtRepassword]').val()==''))
      {
        
        $("#passmatch").toggleClass("hidden");
        $("#chsuccess").hide();
        $("#chpwd").hide();
      }
      else {
        $("#passmatch").hide();
         
        var email = $('[name=txtEmail]').val();
        var oldPassword = $('[name=txtPassword]').val();
        var newPassword = $('[name=txtNewpassword]').val();
        //console.log(newPassword.length);
        
          Accounts.changePassword(oldPassword,newPassword, function(err){
            if(err){
              $("#cherror").toggleClass("hidden");
            }
            else {
              $("#chsuccess").toggleClass("hidden");  
              $("#cherror").hide();
              
            }
          })
        
      }
  }
 
});