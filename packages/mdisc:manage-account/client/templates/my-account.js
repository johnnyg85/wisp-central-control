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
      
  }
});

Template.mdMyAccountUserForm.events({
  'click #btChangePassword':function(event){
    event.preventDefault();

    var email = $('[name=txtEmail]').val();
    var password = $('[name=txtPassword]').val();
    var repass = $('[name=txtPassword]').val();
    //if($('[name=txtPassword]').val()!=$('[name=txtRepassword]').val())
     //   $('.alert').show()
    Accounts.changePassword(password,repass, function(err){
        if(err)
            console.log(err);
        else
            console.log("success");
        
    })
    //if($('[name=txtPassword]').val()!=$('[name=txtRepassword]').val())
     //   $('.alert').show()
    //alert(password);
    
   // Meteor.users.update({_id:Meteor.userId()},{$set:{"services.password.bcrypt":password}})
   // alert(email);
    //alert(password);
  }
 
});