Template.dashboard.helpers({
  jobOpen: function () {
    return MdArchive.collection.find({status: "Open"}).count();
  },
  jobDownloading: function () {
    return MdArchive.collection.find({status: "Downloading"}).count();
  },
  jobReady: function () {
    return MdArchive.collection.find({status: "Ready to Duplicate"}).count();
  },
  jobComplete: function () {
    return MdArchive.collection.find({status: "Shipped"}).count();
  },
  jobTotal: function () {
    return MdArchive.collection.find().count();
  }
});