Template.mdArchivePayment.helpers({
  getMonths: function() {
    return MdDates.getMonths();
  },
  getYears: function() {
    return MdDates.getYears();
  },
  selected: function (plan) {
    var subscription = MdArchive.subscription.findOne({owner: Meteor.userId()});
    selectedPlan = subscription && subscription.subscriptionPlan;
    if (plan == selectedPlan) return true;
    return false;
  }  
});

Template.mdArchivePayment.events({
  'submit': function(e, t) {
    e.preventDefault();
    e.stopPropagation();
    var subBtn = $(e.target).find('button');
    subBtn.prop('disabled', true);

    var subscription = MdArchive.subscription.findOne({owner: Meteor.userId()});
    var formData = {};
    var payment;

    // Build object of form data
    for (var x = 0; x < e.target.length; x++) {
      if (e.target[x].name) {
        formData[e.target[x].name] = e.target[x].value;
      }
    }

    payment = {
      last: formData.cardnumber.substr(formData.cardnumber.length - 4),
      card: formData.cardnumber,
      cvc: formData.cvc,
      expYear: formData.expYear,
      expMonth: formData.expMonth
    };

    Meteor.call('mdEncrypt', payment.card, function (e, r) {
      if (e) {
        WtGrowl.fail("Failed saving payment info.");
        return;
      }
      payment.card = r;
      Meteor.call('mdEncrypt', payment.cvc, function (e, r) {
        if (e) {
          WtGrowl.fail("Failed saving payment info.");
          return;
        }
        payment.cvc = r;
        Meteor.call('mdEncrypt', payment.expYear, function (e, r) {
          if (e) {
            WtGrowl.fail("Failed saving payment info.");
            return;
          }
          payment.expYear = r;
          Meteor.call('mdEncrypt', payment.expMonth, function (e, r) {
            if (e) {
              WtGrowl.fail("Failed saving payment info.");
              return;
            }
            payment.expMonth = r;
            MdArchive.subscription.update({_id: subscription._id}, {$set: {payment: payment}});
            
            var cbCustomer = MdChargeBee.customers.findOne({owner: Meteor.userId()});
            var cardDetails = {
              number: payment.card,
              expMonth: payment.expMonth,
              expYear: payment.expYear,
              cvv: payment.cvc
            };
            Meteor.call('mdChargeBeeUpdateCardInfo', cbCustomer.customerId, cardDetails, function (err, res) {
              subBtn.prop('disabled', false);
              if (err) {
                WtGrowl.fail("Card Failed");
                console.log(err.reason);
              } else {
                WtAccordionPage.enable('arch_review');
                WtAccordionPage.show('arch_review');
              }
            });
            
          });
        });
      });
    });
  }
});
