// Methods on both client and server
Meteor.methods({
  openAutoCloudArchive: function (service) {
    var name = 'My Photos';
    if (Meteor.user().profile) {
      if (Meteor.user().profile.firstname) {
        name = Meteor.user().profile.firstname;
        lastchar = name[name.length - 1];
        if (lastchar == 's') {
          name = name + "' Photos";
        }
        else {
          name = name + "'s Photos";
        }
      }
    }

    var id = MdArchive.collection.insert({
      type: 'Auto Cloud Archive',
      version: '0.0.1',
      service: service,
      status: 'Open',
      size: 'Unknown',
      diskType: 'Unknown',
      disks: 'Unknown',
      archiveName: name,
      archiveType: 'Google Photos full archive',
      price: '35.00',
      initDone: false 
    });
    return id;
  }
});  
