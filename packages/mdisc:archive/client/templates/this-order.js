
Template.mdArchiveThisOrder.helpers({
  archive: function () {
    var archiveId = Session.get('openArchiveId');
    return MdArchive.collection.findOne({_id: archiveId});
  }
});
