// Server side only methods
Meteor.methods({
  getArchiveById: function (archiveId) {
    return MdArchive.collection.findOne({_id: archiveId});
  },
  setArchiveStatus: function (status, archiveId) {
    MdArchive.collection.update({_id: archiveId}, {$set: {status: status}});
  },
  setArchiveSize: function (size, archiveId) {
    MdArchive.collection.update({_id: archiveId}, {$set: {size: size}});
  },
  setArchiveDisks: function (disks, archiveId) {
    MdArchive.collection.update({_id: archiveId}, {$set: {disks: disks}});
  },
  setArchiveDiskType: function (type, archiveId) {
    MdArchive.collection.update({_id: archiveId}, {$set: {diskType: type}});
  },
  setArchiveShippingLabel: function (url, archiveId) {
    MdArchive.collection.update({_id: archiveId}, {$set: {shippingLabel: url}});
  },
  setArchiveShipTo: function (address, archiveId) {
    MdArchive.collection.update({_id: archiveId}, {$set: {shipTo: address}});
  },
  setArchiveTitle: function (title, archiveId) {
    MdArchive.collection.update({_id: archiveId}, {$set: {title: title}});
  },
  pushArchiveScanned: function (archiveId, diskIndex) {
    MdArchive.collection.update({_id: archiveId}, {$push: {scanned: {diskIndex: diskIndex, time: new Date()}}});
    return MdArchive.collection.findOne({_id: archiveId});
  },
  openAutoCloudArchive: function (service) {
    var name = 'My Photos';
    if (Meteor.user().profile.firstname) {
      name = Meteor.user().profile.firstname + "'s Photos";
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
