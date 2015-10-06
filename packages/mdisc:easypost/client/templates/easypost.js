
Template.mdEasyPost.helpers({
   
label: function() {
        var toAddress = {
            name: "Spencer Lambert",
            street1: "810 S OAK DR",
            city: "WOODLAND HILLS",
            state: "UT",
            zip: "84653",
            country: "US"
            };

        var fromAddress = {
            name: "MDisc",
            street1: "915 S 500 E",
            city: "AMERICAN FORK",
            state: "UT",
            zip: "84003"
            };
            
        var parcel ={
            predefined_package: "LargeFlatRateBox",
            weight: 21
        
            };  
        
       /* Meteor.call('mdEasypostVerifyAddress',fromAddress,function(err,res)
        {
            console.log(err, res);
            if(err)
                console.log(err);
            else
                console.log(res);
        } );
      */
        Meteor.call('mdEasypostCreateShipment',toAddress,fromAddress,parcel,function(err,res)
        {
            console.log(err, res);
            if(err)
                console.log(err);
            else
                console.log(res);
        } );
    }
        
});
