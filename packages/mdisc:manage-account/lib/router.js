Router.route('/my-account/', {
  name: 'mdMyAccount', 
  template: 'mdMyAccount'
});

Router.route('/Track-Shipments/:trackid', {
    name:'mdTrackShipment',
    template:'mdTrackShipping',
    data: function(){
       
         var trackCode = this.params.trackid;
         console.log(trackCode);
         return trackCode;
         
    }
    

});