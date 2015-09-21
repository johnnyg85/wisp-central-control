Template.stripePaymentForm.helpers({
    stripePlans: function () {
        return MdStripeMeteor.plans.find({}, {sort: {amount: 1}});
    },
    formatAmount: function (amount) {
        return "$" + (amount / 100);
    }
});

Template.stripePaymentForm.events({
    'submit #payment-form': function (e) {
        e.preventDefault();
        $(e.target).find('button').prop('disabled', true);
        Stripe.card.createToken($(e.target), stripeResponseHandler);
    }
});

var stripeResponseHandler = function StripeResponseHandler(status, response) {
    var $form = $('#payment-form');
    if (response.error) {
        $form.find('.payment-errors').text(response.error.message);
        $form.find('button').prop('disabled', false);
    } else {
        var token = response.id;
        var planid = $form.find('input[name="plan"]:checked').val();
        var email = $form.find('input[name="email"]').val();
        Meteor.call('createCustomer', token, planid, email, function (error, result) {
            if (error) {
                console.log(error.reason);
                $form.find('.payment-errors').text(error.reason);
                $form.find('button').prop('disabled', false);
            } else {
                $form.find('.payment-errors').text('');
                alert('Payment complete.');
            }
        });
    }
};