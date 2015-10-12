Template.mdStripePaymentSimple.helpers({
    getMonths: function() {
        return MdDates.getMonths();
    },
    
    getYears: function() {
        return MdDates.getYears();
    }
});

Template.mdStripePaymentSimple.events({
    'submit #payment-form-simple': function (e) {
        e.preventDefault();
        $(e.target).find('button').prop('disabled', true);
        $('#payment-form-simple').find('.payment-errors').text('');
        $('#payment-form-simple').find('.payment-errors').css("display", "none");
        Stripe.card.createToken($(e.target), stripeResponseHandlerSimple);
    }
});

var stripeResponseHandlerSimple = function StripeResponseHandler(status, response) {
    var $form = $('#payment-form-simple');
    if (response.error) {
        $form.find('.payment-errors').text(response.error.message);
        $form.find('.payment-errors').css("display", "block");
        $form.find('button').prop('disabled', false);
        WtGrowl.fail("Payment Failed");
    } else {
        var options = {
            token: response.id,
        };
        Meteor.call('oneTimePaymentSimple', options, function (error, result) {
            if (error) {
                $form.find('.payment-errors').text(error.reason);
                $form.find('.payment-errors').css("display", "block");
                $form.find('button').prop('disabled', false);
                WtGrowl.fail("Payment Failed");
            } else {
                $form.find('.payment-errors').text('');
                $form.find('.payment-errors').css("display", "none");
                WtGrowl.success("Payment Complete - Thank You!");
                //alert('Payment complete.');

                // TODO: Make sure that the server has validated the payment as well.  So that people cannot fake an order.
                // Order the Archive
                var archiveId = Session.get('openArchiveId');
                var payment = {
                    paid: true,
                    date: new Date(),
                    stripeId: result
                };
                MdArchive.collection.update({_id: archiveId}, {$set: {status: 'Ordered', payment: payment}});
                Meteor.call('downloadArchive', archiveId);

                // Mark for as paid
                $form.find('button').text('Paid - Thank You!');
                $form.find('.payment-amount').addClass('alert-success');
                $form.find('.payment-amount').removeClass('alert-info');

                // disable form
                $form.find('input').prop('disabled', true);
                $form.find('select').prop('disabled', true);
                $form.find('#cardnumber')[0].value = '---';
                $form.find('#cvc')[0].value = '---';

                // Jump to this-order
                //Router.go('mdArchiveThisOrder');
                Meteor.setTimeout(function () {
                    WtTabPage.enable('arch_confirm');
                    WtTabPage.show('arch_confirm');
                }, 3000);

            }
        });
    }
};