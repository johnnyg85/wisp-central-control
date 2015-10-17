// Server side only methods
Meteor.methods({
  getArchiveById: function (archiveId) {
    return MdArchive.collection.findOne({_id: archiveId});
  },
  getArchiveByTrackingId: function (trackingId) {
    return MdArchive.collection.findOne({trackingId: trackingId});
  },
  getArchiveFilesById: function (filesId) {
    return MdArchive.files.findOne({_id: filesId});    
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
    MdArchive.collection.update({_id: archiveId}, {$push: {scanned: {diskIndex: diskIndex, time: new Date(), userId: Meteor.userId()}}});
    return MdArchive.collection.findOne({_id: archiveId});
  },
  pushArchiveShippingScanned: function (archiveId) {
    MdArchive.collection.update({_id: archiveId}, {$push: {shippingScanned: {time: new Date(), userId: Meteor.userId()}}});
    return MdArchive.collection.findOne({_id: archiveId});
  }
});
