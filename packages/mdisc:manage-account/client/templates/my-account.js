Template.mdMyAccount.onRendered(function() {
  Session.set('isCloudConnecting', false);
});

Template.mdMyAccount.helpers({
  orders: function() {
    return MdArchive.collection.find().fetch();
  },
  user: function() {
    return Meteor.user();
  },
  showTrack: function() {
    if(Session.get('showTrack'))
      return true;
    else
      return false;
  }
});

Template.mdMyAccount.events({
  'click #btSignOut':function(event){
     event.preventDefault();
     Meteor.logout();
  }
});

Template.mdMyAccountYourSubscription.helpers({
  checking: function () {
    return Session.get('cb_fetching_subscription');
  },
  hasSubscription: function () {
    return Session.get('cb_has_subscription');
  },
  getSubscriptions: function () {
    return Session.get('cb_subscriptions');
  },
  formatDate: function (timestamp) {
    var d = new Date(timestamp*1000);
    return (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear().toString().substr(2);
  },
  planName: function (planId) {
    return get_chargebee_plan_name(planId);
  },
  planAmount: function (planId) {
    switch (planId) {
      case 'archive-service-annual':
        return '$99/year';
      case 'archive-service-monthly':
        return '$9/month';
      default:
        return 0;
    }
  }
});

Template.mdMyAccountYourSubscription.events({
  'click .subCancelBtn': function (e) {
    e.preventDefault();
    Session.set('cancel_subscription', this.subscription);
    Session.set('cancel_subscription_confirmation', false);
    $('#confText').val('');
  }
});

Template.mdMyAccountYourSubscription.onRendered(function () {
  Session.set('cb_has_subscription', false);
  Session.set('cb_fetching_subscription', false);
  Session.set('cb_subscriptions', 'false');
  get_subscriptions();
});

Template.mdMyAccountCancelSubModal.helpers({
  getSubscription: function () {
    return Session.get('cancel_subscription');
  },
  planName: function (planId) {
    return get_chargebee_plan_name(planId);
  }
});

Template.mdMyAccountCancelSubModal.events({
  'click #confBtn': function () {
    if ($('#confText').val()==='CANCEL') {
      Session.set('cancel_subscription_confirmation', true);
      cancel_subscription();
    } else {
      $('#confSubCancelModal').modal('hide');
      WtGrowl.fail("Please enter CANCEL in the box to cancel subscription.");
    }
  }
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
  },
  isEqual: function(status,checkstat){
    if(status==checkstat)
      return true;
    else
      return false;
  },
  filter: function(status) {
    if (status == 'Ordered' || status == 'Shipped') return status;
    return "Processing";
  }
});

Template.mdMyAccountOrder.events({
  'click a': function(e,t){
     Session.set('Spinner',true);
     Session.set('track',false);
     Session.set('showTrack',true);
     Session.set('trackerr',false);
     trackCode = $(e.target).attr("value");
     Meteor.call('mdEasypostTrackShipment',trackCode,function(err,response)
       {
        if(response) {
           Session.set('Spinner',false);
           Session.set('trackerr',false);
           Session.set('track',response);
         }
         else
         {
           Session.set('Spinner',false);
           Session.set('trackerr',true);
         }
                
       });
   
    
     $('#mdTrack').modal('show');
     
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
    // Update subscription shipping address
    var subscription = MdArchive.subscription.findOne({});
    if (subscription) {
      MdArchive.subscription.update({_id: subscription._id}, {$set:{shipTo: shipTo}}, function (err, res) {
        if (err)
          WtGrowl.fail("Could not update Shipping Information on Subscription");
      });
    }
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

Template.mdMyAccountDataPermissions.onRendered(function() {
  Session.set('googleChecking', true);
  Meteor.call('mdCloudServiceIsConnected', 'Google Photos', function (err, res) {
    if (!err) {
      Session.set('googleConnected', true);
    } else {
      Session.set('googleConnected', false);
    }
    Session.set('googleChecking', false);
  });
});

Template.mdMyAccountDataPermissions.helpers({
  isConnected: function() {
    if (Session.get('googleConnected')===true) {
      return true;
    } else {
      return false;
    }
  }
});

Template.mdMyAccountDataPermissions.events({
  'click #connectNowGoogle': function (e) {
    e.preventDefault();
    MdCloudServices.askCredential('Google Photos', function (err, res) {
      Meteor.call('mdCloudServiceIsConnected', 'Google Photos', function (err, res) {
        if (!err) {
          Session.set('googleConnected', true);
        } else {
          Session.set('googleConnected', false);
        }
      });
    });
  }
});



Template.mdTrack.rendered=function(){
  Session.set('trackerr',false);
  Session.set('track',false);
  Session.set('Spinner',true);
};

Template.mdTrack.helpers({
  trackerror: function() {
    return Session.get('trackerr');
  },
  trackdata: function() {
    trackdata = Session.get('track');
    return trackdata;
  },
  showspinner: function() {
    if(Session.get('Spinner')) {
      return true;
    }
    else {
      return false;
    }
  },
  statusFormat: function(status){
    if(status=="in_transit")
      return "Dispatched";
    else
      return status;
  },
  formatdeliverydate: function(est_delivery_date) {
    var deliverydate = WtDateFormat(est_delivery_date, "shortDate");
    return deliverydate;
  },
  formatlastupdate: function(updated_at) {
    var lastupdate = WtDateFormat(updated_at, "shortDate");
    return lastupdate;
  }
});

function get_subscriptions() {
  Session.set('cb_fetching_subscription', true);
  Meteor.call('mdChargeBeeListSubscriptions', function (err, res) {
    Session.set('cb_fetching_subscription', false);
    if (!err) {
      var hasActiveSubscription = false;
      var activeSubscriptions = new Array;
      if (res && res.length > 0) {
        for (var i = 0; i < res.length; i++) {
          if (res[i].subscription.status && res[i].subscription.status == 'active') {
            hasActiveSubscription = true;
            activeSubscriptions.push(res[i]);
          }
        }
      }
      if (hasActiveSubscription) {
        Session.set('cb_has_subscription', true);
        Session.set('cb_subscriptions', activeSubscriptions);
      }
    }
  });
}

function get_chargebee_plan_name(planId) {
  switch (planId) {
    case 'archive-service-annual':
      return 'Archive Service Annual';
    case 'archive-service-monthly':
      return 'Archive Service Monthly';
    default:
      return planId;
  }
}

function cancel_subscription() {
  var subscription = Session.get('cancel_subscription');
  var conf = Session.get('cancel_subscription_confirmation');
  if (subscription && conf) {
    Meteor.call('mdChargeBeeCancelSubscription', subscription.id, function (err, res) {
      $('#confSubCancelModal').modal('hide');
      if (err) {
        WtGrowl.fail("Failed to cancel subscription.");
      } else {
        WtGrowl.success("Subscription has been cancelled.");
      }
      Session.set('cb_has_subscription', false);
      Session.set('cb_fetching_subscription', false);
      Session.set('cb_subscriptions', 'false');
      Session.set('cancel_subscription', false);
      Session.set('cancel_subscription_confirmation', false);
      $('#confText').val('');
      get_subscriptions();
    });
  }
}