var easypost = Easypost(Meteor.settings.easypost.apiKey);
Future = Npm.require('fibers/future');
// verify address
Meteor.methods({
    mdEasypostVerifyAddress: function(fromAddress) {

        var future = new Future();
        easypost.Address.create(fromAddress, function(err, fromAddress) {
            fromAddress.verify(function(err, response) {
                var verifiedAddress;
                if (err) {
                    console.log('Address is invalid.');

                    future.return(response.message);
                } else if (response.message !== undefined && response.message !== null) {
                    console.log('Address is valid but has an issue: ',
                            response.message);
                    verifiedAddress = response.address;
                    future.return(verifiedAddress);
                } else {
                    verifiedAddress = response.address;
                    console.log(verifiedAddress);
                    future.return(verifiedAddress);
                }

            });
        });
        return future.wait();
    },
    // set parcel

    mdEasypostSetParsel: function(length, width, height, weight) {
        var future = new Future();
        easypost.Parcel.create({
            // predefined_package: "LargeFlatRateBox",
            // weight: 21.2
            'length': length,
            'width': width,
            'height': height,
            'weight': weight


        }, function(err, response) {
            if (err)
                console.log(err);
            else {
                console.log(response.id);
                future.return(response.id);
            }
        });
        return future.wait();
    },
    // create Rates
    mdEasypostShowRates: function(toAddress, fromAddress, pid) {
        console.log(pid);
        var future = new Future();
        easypost.Shipment.create({
            'to_address[id]': toAddress,
            'from_address': fromAddress,
            '[parcel][id]': pid

        }, function(err, shipment) {
            if (err)
                console.log(err);
            else
            {
                var shippmentRates = shipment.rates;
                console.log(shippmentRates);
                future.return(shippmentRates);
            }
        });
        return future.wait();
    },
    //Create Shipment
    mdEasypostCreateShipment: function(toAddress, fromAddress, parcel) {
        var future = new Future();
        easypost.Shipment.create({
            to_address: toAddress,
            from_address: fromAddress,
            parcel: parcel
        }, function(err, shipment) {
            // shipment.lowestRate filters by carrier name and service name, and accepts negative filters 
            // by preceding the name with an exclamation mark
            shipment.buy({rate: shipment.lowestRate(['USPS'], '!LibraryMail, !mediaMAIL')}, function(err, response) {
                var shippmentlabel = response.postage_label.label_url;
                future.return(shippmentlabel);
            });
        });
        return future.wait();
    },
    mdEasypostCreateShipmentLabel: function(rateId, shipId) {
        var future = new Future();
        console.log(rateId);
        console.log(shipId);
        easypost.Shipment.retrieve({
            id: shipId,
            'rates[id]': rateId

        }, function(err, shipment) {
            console.log(shipment);
            shipment.buy(
                    {rate: shipment.selected_rate.rateId},
            function(err, response)
            {
                if (err)
                {
                    console.log(rateId);
                    console.log(err);
                }
                else
                    console.log(response);
            });
        });

        return future.wait();
    }
});