var parcel;
var pid;
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
        /*  var toAddress = {
         name: "Spencer Lambert",
         street1: "810 S OAK DR",
         street2: "",
         city: "WOODLAND HILLS",
         state: "UT",
         zip: "84653",
         country: "US"
         };
         console.log(toAddress);*/
        var toAddress = Session.get('toaddressid');
        var fromAddress = {
            name: "MDisc",
            street1: "915 S 500 E",
            city: "AMERICAN FORK",
            state: "UT",
            zip: "84003"
        };

        var toAddress = Session.get('toaddressid');
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
        Meteor.call('mdEasypostSetParsel', length, width, height, weight, function(err, res) {

            if (err)
                console.log(err);
            else {
                console.log("success");
                //  parcelid=res;
                //      console.log(parcelid);
                //  console.log(res.length);
                console.log(res);
                // ShipingRates = res;
                // console.log(ShippingRates);
                Session.set('parcelid', res);
            }
        });
        var pid = Session.get('parcelid');
        console.log(pid);
        Meteor.call('mdEasypostShowRates', toAddress, fromAddress, pid, function(err, res) {
//console.log(parcelid);
            if (err)
                console.log(err);
            else {
                console.log("success");
                //  console.log(res.length);
                console.log(res);
                // ShipingRates = res;
                // console.log(ShippingRates);
                Session.set('Rates', res);

            }
        });
    },
    'click #chkVerAddress': function(event) {
        // event.preventDefault();
        //alert("gg");

        Session.set('Rateid', $(event.target).closest('tr').data('id'));
        Session.set('ShipId', $(event.target).closest('tr').data('name'));
        WtTabPage.show('md_shipping_label');

// var id=$('[name=chkVerAddress]').val();
        // console.log(id);

    }
});

Template.mdParcel.helpers({
    'Rates': function()
    {
        return Session.get('Rates');
    }
});
    