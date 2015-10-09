var parcel;
Template.mdParcel.rendered = function()
{
    $("#validateforms").validate({
        rules: {
            txtLength: {
                required: true
            },
            txtWidth: {
                required: true
            },
            txtHeight: {
                required: true
            },
            txtWeight: {
                required: true
            }

        },
        messages: {
            txtLength: {
                required: "Length Required!"
            },
            txtWidth: {
                required: "Width required!"
            },
            txtHeight: {
                required: "Height required"
            },
            txtWeight: {
                required: "Weight required"
            }
        }
    });

};
Template.mdParcel.events({
    'submit form': function(event) {
        event.preventDefault();
        var toAddress = {
            name: "Spencer Lambert",
            street1: "810 S OAK DR",
            street2: "",
            city: "WOODLAND HILLS",
            state: "UT",
            zip: "84653",
            country: "US"
        };
        console.log(toAddress);
        var fromAddress = {
            name: "MDisc",
            street1: "915 S 500 E",
            city: "AMERICAN FORK",
            state: "UT",
            zip: "84003"
        };


        var length = $('[name=txtLength]').val();
        var width = $('[name=txtWidth]').val();
        var height = $('[name=txtHeight]').val();
        var weight = $('[name=txtWeight]').val();

        parcel = {
            length: length,
            width: width,
            height: height,
            weight: weight
        };
        console.log("hiiii");
        //  console.log(toAddress);
        console.log(parcel);
        Meteor.call('mdEasypostShowRates', toAddress, fromAddress, parcel, function(err, res) {

            if (err)
                console.log(err);
            else {
                console.log("success");
                console.log(res.length);
                console.log(res);
                // ShipingRates = res;
                // console.log(ShippingRates);
                Session.set('Rates', res);
            }
        });
    }
});

Template.mdParcel.helpers({
    'Rates': function()
    {
        return Session.get('Rates');
    }
});
    