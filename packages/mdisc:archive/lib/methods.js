// Methods on both client and server
Meteor.methods({
  openAutoCloudArchive: function (service) {
    var id = MdArchive.collection.insert({
      type: 'Auto Cloud Archive',
      service: service,
      status: 'Open',
      size: 'Unknown',
      diskType: 'Unknown',
      initDone: false 
    });
    return id;
  }
});
