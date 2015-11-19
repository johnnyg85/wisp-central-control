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
  setArchiveTrackingId: function (trackingId, archiveId) {
    MdArchive.collection.update({_id: archiveId}, {$set: {trackingId: trackingId}});
  },
  setArchiveShipTo: function (address, archiveId) {
    MdArchive.collection.update({_id: archiveId}, {$set: {shipTo: address}});
  },
  setArchiveTitle: function (title, archiveId) {
    MdArchive.collection.update({_id: archiveId}, {$set: {title: title}});
  },
  setArchiveNasDir: function (dir, archiveId) {
    MdArchive.collection.update({_id: archiveId}, {$set: {nasDir: dir}});
  },
  pushArchiveScanned: function (archiveId, diskIndex) {
    MdArchive.collection.update({_id: archiveId}, {$push: {scanned: {diskIndex: diskIndex, time: new Date(), userId: Meteor.userId()}}});
    return MdArchive.collection.findOne({_id: archiveId});
  },
  pushArchiveShippingScanned: function (archiveId) {
    MdArchive.collection.update({_id: archiveId}, {$push: {shippingScanned: {time: new Date(), userId: Meteor.userId()}}});
    return MdArchive.collection.findOne({_id: archiveId});
  },
  getArchiveShippingLabel: function (archiveId) {
    var archive = MdArchive.collection.findOne({_id: archiveId});
    if (archive.shippingLabel) {
      return archive;
    } else {
      var toAddress = {
        name: archive.shipTo.name,
        street1: archive.shipTo.address,
        street2: archive.shipTo.address2,
        city: archive.shipTo.city,
        state: archive.shipTo.state,
        zip: archive.shipTo.zip
      };
      var fromAddress = {
        name: "MDisc",
        street1: "915 S 500 E",
        city: "AMERICAN FORK",
        state: "UT",
        zip: "84003"
      };
      var parcel = {
        length: 5,
        width: 5,
        height: 5,
        weight: 10
      };
      var shipment = Meteor.call('mdEasypostCreateShipment', toAddress, fromAddress, parcel);
      if (shipment) {
        Meteor.call('setArchiveShippingLabel', shipment.postage_label.label_url, archiveId);
        Meteor.call('setArchiveTrackingId', shipment.tracking_code, archiveId);
        return MdArchive.collection.findOne({_id: archiveId});
      } else {
        throw new Meteor.Error("easypost-error", "Failed to create shipping label.");
      }
    }
  },
  createInitialCloudArchive: function (service, forUserId) {
    // Check if calling user is admin
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      throw new Meteor.Error("create-archive", "Not authorized");
    }
    var subscription = MdArchive.subscription.findOne({owner: forUserId});
    var id = MdArchive.collection.insert({
      type: 'Auto Cloud Archive',
      version: '0.0.2',
      service: service,
      status: 'Ordered',
      size: 'Unknown',
      diskType: 'Unknown',
      disks: 'Unknown',
      archiveName: subscription.archiveName,
      archiveType: 'Initial Archive (' + service + ')'
    });
    // update the ownerId
    MdArchive.collection.update({_id: id}, {$set:{owner: forUserId}});

    // Get a unique order number and update the archive
    Meteor.call('mdCreateOrderNumber', function(err, res) {
        var orderNumber;
        if (err) {
            orderNumber = 'DEFAULT';
        } else {
            orderNumber = res;
        }
        MdArchive.collection.update({_id: id}, {$set: {orderNumber: orderNumber}});
    });

    // start the download
    Meteor.call('downloadArchive', id);
    
  }

});
