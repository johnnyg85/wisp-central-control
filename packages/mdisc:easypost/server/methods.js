var easypost = Easypost(Meteor.settings.easypost.apiKey);
Future = Npm.require('fibers/future');
 exec = Npm.require('child_process').exec;
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
    //Create rates without verified addresses
    mdEasypostShowRate: function(toAddress, fromAddress, pid) {
        console.log(pid);
        var future = new Future();
        easypost.Shipment.create({
            'to_address': toAddress,
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

    mdEasypostCreateShipmentLabel: function(rateId, shipId) {
        var future = new Future();
        easypost.Shipment.retrieve({
            id: shipId
        }, function(err, shipment) {
            // console.log(shipment);
            shipment.buy(
                    {
                        'rate[id]': rateId
                    },
            function(err, response)
            {
                if (err)
                {

                    console.log(err);
                }
                else {
                    console.log(shipment);
                    var shippmentlabel = shipment.postage_label.label_url;
                    future.return(shippmentlabel);
                    //  console.log("fffffffffffffff");
                    //  console.log(shipment);
                }

            });
        });

        return future.wait();
    },
    mdEasypostTrackShipment: function(trackId) {
        var future = new Future();
        easypost.Tracker.create({
            tracking_code: trackId,
            carrier: 'USPS'
        }, function(err, response) {
            if (err)
                console.log(err);
            else
            {
                future.return(response);
                //console.log(response);
            }
        });
        return future.wait();
    },
    
    mdEasypostCreateShipment: function (toAddress, fromAddress, parcel) {
        var future = new Future();
        easypost.Shipment.create({
            to_address: toAddress,
            from_address: fromAddress,
            parcel: parcel
        }, function (err, shipment) {
            if (!err) {
                shipment.buy({rate: shipment.lowestRate(['USPS', 'ups'])}, function (err, shipment) {
                    if (!err) {
                        future.return(shipment);
                    } else {
                        future.return(false);
                    }
                });
            }
        });
        return future.wait();
    }
});