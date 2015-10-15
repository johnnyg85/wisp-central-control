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


        var fromAddress = {
            name: "MDisc",
            street1: "915 S 500 E",
            city: "AMERICAN FORK",
            state: "UT",
            zip: "84003"
        };

        //var toAddress = Session.get('toaddressid');
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

        console.log(parcel);
         var toAddress = Session.get('toaddressid');
  
        if(Session.get('toaddressid'))
        {
        Meteor.call('mdEasypostSetParsel', length, width, height, weight, function(err, res) {

            if (err)
                console.log(err);
            else {

                Session.set('parcelid', res);
            }
        });
       
        var pid = Session.get('parcelid');

       
           

            Meteor.call('mdEasypostShowRates', toAddress, fromAddress, pid, function(err, res) {

                if (err)
                    console.log(err);
                else {
                    Session.set('Rates', res);

                }
            });
        }
        else
        {
            alert("Provide a valid shipping address!!");
            WtTabPage.show('md_shipping_address');
        }
        
    },
    'click #chkVerAddress': function(event) {

        Session.set('Rateid', $(event.target).closest('tr').data('id'));
        Session.set('ShipId', $(event.target).closest('tr').data('name'));
        WtTabPage.show('md_shipping_label');

    }
});

Template.mdParcel.helpers({
    'Rates': function()
    {
        return Session.get('Rates');
    }
});
    