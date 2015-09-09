Meteor.methods({
  addCredential: function(service, credentialToken, credentialSecret) {
    var credentialDetail = OAuth.retrieveCredential(credentialToken, credentialSecret);
    var credential = MdCloudServices.credentials.findOne({owner: this.userId, service: service});
    if (credential) {
      MdCloudServices.credentials.update({_id: credential._id}, {$set: {service: service, credentialToken: credentialToken, credentialSecret: credentialSecret, credential: credentialDetail}});
    } else {
      MdCloudServices.credentials.insert({service: service, credentialToken: credentialToken, credentialSecret: credentialSecret, credential: credentialDetail});
    }
  },
  updateRecentPhotos: function(service) {
    var userId = this.userId;
    switch (service) {
      case 'Google Photos':
        var credential = MdCloudServices.credentials.findOne({owner: userId, service: service});
        if (credential) {
          //check if token has expired.
          var now = new Date();
          var expDate = new Date(credential.credential.serviceData.expiresAt);
          var timeLeft = expDate - now;
          if (timeLeft < 60000) {
            // expired or less than a minute remaining
            credential = MdCloudServices.renewCredential(credential);              
          }
          var accessToken = credential.credential.serviceData.accessToken;
          if (accessToken) {
            gPhotos.setAccessToken(accessToken);
            gPhotos.getRecent(Meteor.bindEnvironment(function(err, res) {
              var len = res.feed.entry.length;
              var urls = [];
              for (var x = 0; x < len; x++) {
                console.log(res.feed.entry[x].content.src);
                urls.push(res.feed.entry[x].content.src);
              }
              var doc = MdCloudServices.recentPhotos.findOne({owner: userId});
              if (doc) {
                MdCloudServices.recentPhotos.update({_id: doc._id}, {$set: {urls: urls}});
              } else {
                MdCloudServices.recentPhotos.insert({urls: urls});                
              }
            }));
          }
        }
        break;
    }
  }
});