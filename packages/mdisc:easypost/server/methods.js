var easypost =Easypost(Meteor.settings.easypost.apiKey);
Future = Npm.require('fibers/future');
//console.log(easypost);
// verify address
Meteor.methods({

    mdEasypostVerifyAddress: function(fromAddress) {
        console.log("hi");
        var myFuture1 = new Future();
        easypost.Address.create(fromAddress, function(err, fromAddress) {
            var myFuture2 = new Future();
            fromAddress.verify(function(err, response) {
                if (err) {
                    console.log('Address is invalid.');
                } else if (response.message !== undefined && response.message !== null) {
                    console.log('Address is valid but has an issue: ', response.message);
                    var verifiedAddress = response.address;
                } else {
                    var verifiedAddress = response;
                    console.log(verifiedAddress);
                     myFuture2.return(verifiedAddress);
                }
            });
            myFuture1.return(myFuture2.wait());
        });
        return myFuture1.wait();
           

},
// set parcel

mdEasypostSetParsel:function(){
easypost.Parcel.create({
predefined_package: "InvalidPackageName",
weight: 21.2
}, function(err, response) {
console.log(err);
});
},

// create shipment
mdEasypostCreateShipment:function(toAddress,fromAddress,parcel)
{
easypost.Shipment.create({
to_address: toAddress,
from_address: fromAddress,
parcel: parcel
}, function(err, shipment) {
// shipment.lowestRate filters by carrier name and service name, and accepts negative filters by preceding the name with an exclamation mark
shipment.buy({rate: shipment.lowestRate(['USPS'], '!LibraryMail, !mediaMAIL')}, function(err, shipment) {
console.log(shipment);

});
return shipment;
});
}
});