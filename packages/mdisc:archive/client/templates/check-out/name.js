Template.mdArchiveName.helpers({
  subscription: function() {
    return MdArchive.subscription.findOne({owner: Meteor.userId()});
  }
});

Template.mdArchiveName.events({
  'submit #archive-name-form': function(e, t) {
    e.preventDefault();
    var subscription = MdArchive.subscription.findOne({owner: Meteor.userId()});
    if (subscription) {
      MdArchive.subscription.update({_id: subscription._id}, {$set: {archiveName: e.target[0].value}});
    } else {
      var data = {
        archiveName: e.target[0].value,
        active: false,
        version: '0.0.1'
      }
      MdArchive.subscription.insert(data);
    }
    WtAccordionPage.enable('arch_plan');
    WtAccordionPage.show('arch_plan');
  }  
});