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

    mdEasypostSetParsel: function(parcel) {
        
        easypost.Parcel.create(parcel, function(err, parcel) {
            // predefined_package: "LargeFlatRateBox",
            // weight: 21.2

        }, function(err, response) {
            console.log(response);
        });
    },
    // create Rates
    mdEasypostShowRates: function(toAddress, fromAddress, parcel) {
        var future = new Future();
        easypost.Shipment.create({
            to_address: toAddress,
            from_address: fromAddress,
            parcel: parcel

        }, function(err, shipment) {
            var shippmentRates = shipment.rates;
            console.log(shippmentRates);
            future.return(shippmentRates);
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
    }
});