subsManager = new SubsManager();

WtCollection = function(collectionName) {

  // Create new collection
  var wtCollection = new Mongo.Collection(collectionName);

  // Set basic permissions
  // TODO: Add better access control (The owner control might be enough)
  wtCollection.allow({
    insert: function(userId, doc) {
      return !! userId;
    },
    update: function(userId, doc) {
      return !! userId;
    }
  });

  if (Meteor.isServer) {
    Meteor.publish(collectionName, function() {
      if (!this.userId) return null;

      // TODO: When publishing md_archive, should suppress the file list, as it can be long.

      // Only publish all to admins
      if (Roles.userIsInRole(this.userId, ['admin'])) {
        return wtCollection.find();
      } else {
        return wtCollection.find({owner: this.userId});        
      }

    });

    wtCollection.before.insert(function(userId, doc) {
      // Created date
      doc.createdAt = new Date();
      // document creator and owner
      doc.creator = userId;
      doc.owner = userId;
    });

    wtCollection.before.update(function(userId, doc, fieldNames, modifier, options) {
      if (!Roles.userIsInRole(userId, ['admin'])) {
        // Check if the user owns this doc
        if (doc.owner != userId)
          throw new Meteor.Error(403, "Access denied")
      }
      // Updated date
      modifier.$set = modifier.$set || {};
      modifier.$set.updatedAt = new Date();
    });
  }

  if (Meteor.isClient) {
    subsManager.subscribe(collectionName);
  }

  return wtCollection;

};