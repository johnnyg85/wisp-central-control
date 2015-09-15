
Template.mdArchiveAll.helpers({
  archives: function () {
    return MdArchive.collection.find().fetch();
  }
});
