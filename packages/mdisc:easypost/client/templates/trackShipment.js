  Template.mdTrackShipping.events({
  'click #btTrackShipment':function(event){
         event.preventDefault();
         var trackCode="EZ1000000001";
         console.log(trackCode);
         Meteor.call('mdEasypostTrackShipment',trackCode,function(err,response)
         {
             if(err)
                 console.log(err);
             else
             {
                 Session.set('track',response);
             }
                
         });
    }
});


Template.mdTrackShipping.helpers({
    track: function() {
       
        return Session.get('track');
    }
});