// Server side only methods
Meteor.methods({
  getArchiveById: function (archiveId) {
    return MdArchive.collection.findOne({_id: archiveId});
  },
  getArchiveByTrackingId: function (trackingId) {
    return MdArchive.collection.findOne({trackingId: trackingId});
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
  appendToArchiveScanned: function (archiveId, diskIndex) {
    MdArchive.collection.update({_id: archiveId}, {$push: {scanned: {diskIndex: diskIndex, time: new Date()}}});
    return MdArchive.collection.findOne({_id: archiveId});
  },
  setShippingLabel: function (url, archiveId) {
    MdArchive.collection.update({_id: archiveId}, {$set: {shippingLabel: url}});
  },
  appendToArchiveShippingScanned: function (archiveId) {
    MdArchive.collection.update({_id: archiveId}, {$push: {shippingScanned: {time: new Date()}}});
    return MdArchive.collection.findOne({_id: archiveId});
  }
});
