Template.mdStripePayment.helpers({
    getMonths: function() {
        return MdDates.getMonths();
    },
    
    getYears: function() {
        return MdDates.getYears();
    }
});

Template.mdStripePayment.events({
    'submit #payment-form': function (e) {
        e.preventDefault();
        $(e.target).find('button').prop('disabled', true);
        $('#payment-form').find('.payment-errors').text('');
        $('#payment-form').find('.payment-errors').css("display", "none");
        Stripe.card.createToken($(e.target), stripeResponseHandler);
    }
});

var stripeResponseHandler = function StripeResponseHandler(status, response) {
    var $form = $('#payment-form');
    if (response.error) {
        $form.find('.payment-errors').text(response.error.message);
        $form.find('.payment-errors').css("display", "block");
        $form.find('button').prop('disabled', false);
    } else {
        var options = {
            token: response.id,
            email: $form.find('input[name="email"]').val(),
            name: $form.find('input[name="name"]').val(),
            address: $form.find('input[name="address"]').val(),
            city: $form.find('input[name="city"]').val(),
            state: $form.find('select[name="state"]').val(),
            zip: $form.find('input[name="zip"]').val()
        };
        Meteor.call('oneTimePayment', options, function (error, result) {
            if (error) {
                $form.find('.payment-errors').text(error.reason);
                $form.find('.payment-errors').css("display", "block");
                $form.find('button').prop('disabled', false);
            } else {
                $form.find('.payment-errors').text('');
                $form.find('.payment-errors').css("display", "none");
                //alert('Payment complete.');

                // TODO: Make sure that the server has validated the payment as well.  So that people can fake an order.
                // Order the Archive
                var archiveId = Session.get('openArchiveId');
                MdArchive.collection.update({_id: archiveId}, {$set: {status: 'Ordered'}});
                Meteor.call('downloadArchive', archiveId);
                // Jump to this-order
                Router.go('mdArchiveThisOrder');
            }
        });
    }
};