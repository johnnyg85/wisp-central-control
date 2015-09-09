subsManager = new SubsManager();

WtCollection = function(collectionName) {

  // Create new collection
  var wtCollection = new Mongo.Collection(collectionName);

  // Set basic permissions
  // TODO: Add better access control
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
      // TODO: filter by ownerId or by by admin level
      return wtCollection.find();
    });

    wtCollection.before.insert(function(userId, doc) {
      doc.createdAt = new Date();
      doc.creator = userId;
      doc.owner = userId;
    });

    wtCollection.before.update(function(userId, doc, fieldNames, modifier, options) {
      modifier.$set = modifier.$set || {};
      modifier.$set.updatedAt = new Date();
    });
  }

  if (Meteor.isClient) {
    subsManager.subscribe(collectionName);
  }

  // Not really using this at the moment, because AutoForm is doing the updates.
  wtCollection.updateFeild = function (id, data, options, callback) {
    var res = this.update({_id: id}, {$set: data}, options, callback);
  }

  return wtCollection;

};