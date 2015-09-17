
Template.mdArchivePlaceOrderButton.events({
  'click a#archivePlaceOrder': function(e, t) {

    var archiveId = Session.get('openArchiveId');

    MdArchive.collection.update({_id: archiveId}, {$set: {status: 'Ordered'}});
    Meteor.call('downloadArchive', archiveId);

  }
});
