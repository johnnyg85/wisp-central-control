Meteor.methods({
  openAutoCloudArchive: function (service) {
    var id = MdArchive.insert({
      type: 'Auto Cloud Archive',
      service: service,
      status: 'Open',
      initDone: false 
    });
    if (Meteor.isServer) {
      MdJobs.initAutoCloudArchive(id);
    }
    return id;
  }  
});