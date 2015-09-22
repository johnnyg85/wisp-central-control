Template.stripePaymentForm.helpers({
    stripePlans: function () {
        return MdStripeMeteor.plans.find({}, {sort: {amount: 1}});
    },
    formatAmount: function (amount) {
        return "$" + (amount / 100);
    },
    getMonths: function() {
        return [
            {name: "Jan", val: "01"},
            {name: "Feb", val: "02"},
            {name: "Mar", val: "03"},
            {name: "Apr", val: "04"},
            {name: "May", val: "05"},
            {name: "Jun", val: "06"},
            {name: "Jul", val: "07"},
            {name: "Aug", val: "08"},
            {name: "Sep", val: "09"},
            {name: "Oct", val: "10"},
            {name: "Nov", val: "11"},
            {name: "Dec", val: "12"}
        ];
    },
    getYears: function() {
        var d = new Date();
        var years = new Array();
        for (var i=0, year=d.getFullYear(); i<=30; i++,year++) {
            years.push({"year": year});
        }
        return years;
    }
});

Template.stripePaymentForm.events({
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
        var token = response.id;
        var planid = $form.find('input[name="plan"]:checked').val();
        var email = $form.find('input[name="email"]').val();
        Meteor.call('createCustomer', token, planid, email, function (error, result) {
            if (error) {
                console.log(error.reason);
                $form.find('.payment-errors').text(error.reason);
                $form.find('.payment-errors').css("display", "block");
                $form.find('button').prop('disabled', false);
            } else {
                $form.find('.payment-errors').text('');
                $form.find('.payment-errors').css("display", "none");
                alert('Payment complete.');
            }
        });
    }
};