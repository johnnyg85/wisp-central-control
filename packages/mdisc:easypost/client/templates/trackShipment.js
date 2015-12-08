  var trackCode;
  Template.mdTrackShipping.rendered=function()
  {
    Session.set('track',false);
    trackCode=this.data;
      
  };
  
  Template.mdTrackShipping.events({
  'click #btTrackShipment':function(event){
         event.preventDefault();
        // var trackCode="EZ1000000001";
        
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