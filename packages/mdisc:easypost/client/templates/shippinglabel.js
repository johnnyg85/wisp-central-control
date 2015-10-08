
Template.mdShippinglabel.events({
    'click #btShipmentLabel': function(event) {
        /*console.log("Shippment Label");
         console.log(address);*/
        event.preventDefault();
        var name = $('[name=txtName]').val();
        var street1 = $('[name=txtStreet1]').val();
        var street2 = $('[name=txtStreet2]').val();
        var city = $('[name=txtCity]').val();
        var state = $('[name=txtState]').val();
        var zip = $('[name=txtZip]').val();
        var country = $('[name=txtCountry]').val();
        var toAddress = {
            name: name,
            street1: street1,
            street2: street2,
            city: city,
            state: state,
            zip: zip,
            country: country
        };
        var fromAddress = {
            name: "MDisc",
            street1: "915 S 500 E",
            city: "AMERICAN FORK",
            state: "UT",
            zip: "84003"
        };

        var parcel = {
            predefined_package: "LargeFlatRateBox",
            weight: 21

        };

        Meteor.call('mdEasypostCreateShipment', toAddress, fromAddress, parcel, function(err, res) {

            if (err)
                console.log(err);
            else {
                console.log("success");
                //console.log(res);
                ShipingLabel = res;
                //  console.log(ShippingLabel);
                
            }
        });
    }
});

Template.mdShippinglabel.helpers({
    labelUrl: function() {
        //console.log("hellllloooo");
        //console.log(ShipingLabel);
        return Session.get('labelurl');
    }
});