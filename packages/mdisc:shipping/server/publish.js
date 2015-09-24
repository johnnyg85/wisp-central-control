Meteor.publish('mdarchives', function() {
    return MdShippingPage.archives.find({"status": {$ne:"Shipped"}});
});
