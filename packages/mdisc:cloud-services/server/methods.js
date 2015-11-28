Future = Npm.require('fibers/future');

Meteor.methods({
  addCredential: function(service, credentialToken, credentialSecret) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized"); // Check user logged in.
    var credentialDetail = OAuth.retrieveCredential(credentialToken, credentialSecret);

    var data = {
      service: service,
      credentialToken: MdAES.encrypt(credentialToken),
      credentialSecret: MdAES.encrypt(credentialSecret)
    };

    // set other data if we have it.
    if (credentialDetail.serviceData) {
      credentialDetail.serviceData.refreshToken && (data.refreshToken = MdAES.encrypt(credentialDetail.serviceData.refreshToken));
      credentialDetail.serviceData.accessToken && (data.accessToken = MdAES.encrypt(credentialDetail.serviceData.accessToken));
      credentialDetail.serviceData.expiresAt && (data.expiresAt = credentialDetail.serviceData.expiresAt);
      credentialDetail.serviceData.idToken && (data.idToken = credentialDetail.serviceData.idToken);
    }

    var credential = MdCloudServices.credentials.findOne({owner: this.userId, service: service});
    if (credential) {
      MdCloudServices.credentials.update({_id: credential._id}, {$set: data});
    } else {
      MdCloudServices.credentials.insert(data);
    }
  },
  getAccountSize: function(service) {
    if (!this.userId) throw new Meteor.Error(401, "Not authorized"); // Check user logged in.
    var estimatedSize;
    var credential = MdCloudServices.credentials.findOne({owner: this.userId, service: service});
    if (!credential) {
      throw new Meteor.Error('recent-photos', 'No credentials found.');
    }

    switch (service) {
      case 'Google Photos':
        var client = new gPhotos(credential);
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
    var credential = MdCloudServices.credentials.findOne({owner: this.userId, service: service});
    if (!credential) {
      throw new Meteor.Error('recent-photos', 'No credentials found.');
    }

    switch (service) {
      case 'Google Photos':
        var client = new gPhotos(credential);
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
    var credential = MdCloudServices.credentials.findOne({owner: userId, service: service});
    if (!credential) {
      throw new Meteor.Error('get-token', 'No credentials found.');
    }

    // Check the credentials
    switch (service) {
      case 'Google Photos':
        var client = new gPhotos(credential);
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
          credential = MdCloudServices.credentials.findOne({owner: userId, service: service});
          token = {
            accessToken: credential.accessToken && (MdAES.decrypt(credential.accessToken)),
            expiresAt: credential.expiresAt
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
    var credential = MdCloudServices.credentials.findOne({owner: this.userId, service: service});
    if (!credential) {
      throw new Meteor.Error('cloud-service', 'No credentials found.');
    }

    switch (service) {
      case "Google Photos":
        var client = new gPhotos(credential);
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