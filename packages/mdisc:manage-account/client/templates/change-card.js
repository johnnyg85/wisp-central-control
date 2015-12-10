Template.mdMyAccountChangeCardModal.helpers({
  getMonths: function() {
    return MdDates.getMonths();
  },
  getYears: function() {
    return MdDates.getYears();
  },
  defaultDisplayYear: function(year) {
    return MdDates.nextYear()===year;
  }
});

Template.mdMyAccountChangeCardModal.events({
  'click #updateBtn': function (e) {
    e.preventDefault();
    e.stopPropagation();
    var updateBtn = $('#updateBtn');
    updateBtn.prop('disabled', true);
    
    var subscription = MdArchive.subscription.findOne({owner: Meteor.userId()});
    
    payment = {
      last: $('#cardnumber').val().substr($('#cardnumber').val().length - 4),
      card: $('#cardnumber').val(),
      cvc: $('#cvc').val(),
      expYear: $('#expYear').val(),
      expMonth: $('#expMonth').val()
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
              updateBtn.prop('disabled', false);
              $('#changeCardModal').modal('hide');
              if (err) {
                WtGrowl.fail("Failed to update card.");
                console.log(err.reason);
              } else {
                WtGrowl.success('Card updated.');
              }
            });

          });
        });
      });
    });
  }
});
