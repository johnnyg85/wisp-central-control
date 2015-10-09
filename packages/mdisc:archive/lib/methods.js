// Methods on both client and server
Meteor.methods({
  openAutoCloudArchive: function (service) {
    var id = MdArchive.collection.insert({
      type: 'Auto Cloud Archive',
      version: '0.0.1',
      service: service,
      status: 'Open',
      size: 'Unknown',
      diskType: 'Unknown',
      disks: 'Unknown',
      initDone: false 
    });
    return id;
  }
});
