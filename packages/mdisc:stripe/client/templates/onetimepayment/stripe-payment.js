Template.mdStripePayment.helpers({
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
                alert('Payment complete.');
            }
        });
    }
};