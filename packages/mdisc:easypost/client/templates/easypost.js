var toAddress;
var ShipingLabel;

Template.mdShippingAddress.rendered = function()
{
    $("#validateform").validate({
        rules: {
            txtName: {
                required: true,
            },
            txtStreet1: {
                required: true,
            },
            txtCity: {
                required: true,
            },
            txtState: {
                required: true,
            },
            txtCountry: {
                required: true,
            },
            txtZip: {
                required: true
            }

        },
        messages: {
            txtName: {
                required: "Name Required!"
            },
            txtStreet1: {
                required: "Street1 required!"
            },
            txtCity: {
                required: "City required"
            },
            txtState: {
                required: "State required"
            },
            txtCountry: {
                required: "Country required"
            },
            txtZip: {
                required: "Zip code required"
            }
        }
    });

};

Template.mdShippingAddress.events({
    'submit form': function(event) {
        //  event.preventDefault();
        event.preventDefault();

        var name = $('[name=txtName]').val();
        var street1 = $('[name=txtStreet1]').val();
        var street2 = $('[name=txtStreet2]').val();
        var city = $('[name=txtCity]').val();
        var state = $('[name=txtState]').val();
        var zip = $('[name=txtZip]').val();
        var country = $('[name=txtCountry]').val();
        toAddress = {
            name: name,
            street1: street1,
            street2: street2,
            city: city,
            state: state,
            zip: zip,
            country: country
        };
        // console.log("hiiii");
        console.log(toAddress);

        Meteor.call('mdEasypostVerifyAddress', toAddress, function(err, res) {

            if (err) {
                console.log("i");
                console.log(err);
                alert(err);
            }
            else {
                console.log("f");
                if (res !== null)
                {
                    console.log("i)");
                    console.log(res.id);
                    console.log(res);
                    address = res;

                    Session.set('verifiedAddress', address);
                    Session.set('toaddressid',address.id);
                }
                else
                {
                    console.log("er");
                    console.log(err);
                    alert("error");
                }

            }
        });
    },
    'click #chkAddress': function(event) {
        //  alert("Selected");
        if (($('[name=txtName]').val() != '') && ($('[name=txtStreet1]').val() != '') && ($('[name=txtCity]').val() != '')
                && ($('[name=txtState]').val() != '') && ($('[name=txtZip]').val() != '') && ($('[name=txtCountry]').val() != ''))
            WtTabPage.show('md_shipping_parcel');
        else
            alert('Provide a Valid address');
        // Router.go('parcel');



    },
    'click #chkVerAddress': function(event) {
        //  alert("Selected");
        // Router.go('parcel');
        WtTabPage.show('md_shipping_parcel');
    },
    'click .main': function() {
        $(".main").fadeOut();
        Session.set('verifiedAddress', true);
    }


});


Template.mdShippingAddress.helpers({
    address: function()
    {
        console.log("hh");

        return Session.get('verifiedAddress');
    },
    label: function() {


    },
    showMessage: function() {
        // because the Session variable will most probably be undefined the first time
        return !Session.get('verifiedAddress');
    }

});
