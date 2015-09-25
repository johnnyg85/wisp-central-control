Meteor.publish('mdarchives_shipping', function() {
    return MdArchive.collection.find({"status": {$ne:"Shipped"}});
});
