Future = Npm.require('fibers/future');

Meteor.methods({
  getAccountSize: function(service) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized"); // Check user logged in.
    var user = Meteor.user();
    if (!user.services) throw new Meteor.Error('user', "no services"); 
    var estimatedSize;

    switch (service) {
      case 'Google Photos':
        if (!user.services.google) throw new Meteor.Error('google', "no google credential"); 
        var client = new gPhotos(user.services.google);
        var myFuture = new Future();
        client.getQuota(Meteor.bindEnvironment(function(err, res) {
          if (err) {
            myFuture.return(null);
            return;
          }
          if (typeof res == 'string') {
            // didn't get the expected JSON object.
            console.log('Error in getAccountSize: ' + res);
            myFuture.return([]);
            return;
          }
          //WARNING: some accounts don't have a quota value.
          if (res.feed.gphoto$quotacurrent) {
            estimatedSize = res.feed.gphoto$quotacurrent.$t;
            //console.log(estimatedSize);
            myFuture.return(estimatedSize);
          } else {
            myFuture.return(null);
          }
        }));
        return myFuture.wait();
        break;
    }
    return estimatedSize;
  },
  getRecentPhotos: function(service) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized"); // Check user logged in.
    var user = Meteor.user();
    if (!user.services) throw new Meteor.Error('user', "no services"); 

    switch (service) {
      case 'Google Photos':
        if (!user.services.google) throw new Meteor.Error('google', "no google credential"); 
        var client = new gPhotos(user.services.google);
        var myFuture = new Future();
        client.getRecent(Meteor.bindEnvironment(function(err, res) {
          if (err) {
            myFuture.return([]);
            return;
          }
          if (typeof res == 'string') {
            // didn't get the expected JSON object.
            // This can happen with expired tokens
            console.log('Error in getRecentPhotos: ' + res);
            myFuture.return([]);
            return;
          }

          var urls = [];
          // check that we have some photos
          if (res.feed.openSearch$totalResults.$t != 0) {
            var len = res.feed.entry.length;
            for (var x = 0; x < len; x++) {
              //console.log(res.feed.entry[x].content.src);
              urls.push(res.feed.entry[x].content.src);
            }
          }
          myFuture.return(urls);
          return;
        }));
        return myFuture.wait();
        break;
    }
    return [];
  },
  getAccessToken: function(service, userId) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized"); // Check user logged in.
    // Check user access level
    if (!Roles.userIsInRole(this.userId, ['admin'])) {
      throw new Meteor.Error('get-token', 'Access denied.');
    }

    // Get the credentials 
    var user = Meteor.users.findOne({_id: userId});
    if (!user.services) throw new Meteor.Error('user', "no services"); 

    // Check the credentials
    switch (service) {
      case 'Google Photos':
        if (!user.services.google) throw new Meteor.Error('google', "no google credential"); 
        var client = new gPhotos(user.services.google);
        var myFuture = new Future();
        client.testAccess(Meteor.bindEnvironment(function(err, res) {
          if (err) {
            myFuture.return("false");
          } else {
            myFuture.return("true");
          }
        }));
        var result = myFuture.wait();
        if (result === "true") {
          // pull credential again, incase it was renewed.
          user = Meteor.users.findOne({_id: userId});
          token = {
            accessToken: user.services.google.accessToken,
            expiresAt: user.services.google.expiresAt
          }
          return token;
        }
        break;
    }

    // catch all
    throw new Meteor.Error('get-token', 'Not connected to "' + service + '" service.');

  },
  mdCloudServiceIsConnected: function (service) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized"); // Check user logged in.
    var user = Meteor.user();
    if (!user.services) throw new Meteor.Error('user', "no services"); 

    switch (service) {
      case 'Google Photos':
        if (!user.services.google) throw new Meteor.Error('google', "no google credential"); 
        var client = new gPhotos(user.services.google);
        var myFuture = new Future();
        client.testAccess(Meteor.bindEnvironment(function(err, res) {
          if (err) {
            myFuture.return("false");
          } else {
            myFuture.return("true");
          }
        }));
        var result = myFuture.wait();
        if (result === "true") {
          return true;
        } else {
          throw new Meteor.Error('google-photos', 'Not connected to Google Photos services.');
        }
        break;
    }
  }
});