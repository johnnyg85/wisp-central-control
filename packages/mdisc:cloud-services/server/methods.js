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
            //credential = MdCloudServices.renewCredential(credential);              
          }
          var accessToken = credential.credential.serviceData.accessToken;
          if (accessToken) {
            var client = new gPhotos(accessToken);
            client.getRecent(Meteor.bindEnvironment(function(err, res) {
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
  },
  initAutoCloudArchive: function(service, archiveId) {
    // Get all the files to be used in the archive
    var userId = this.userId;
    console.log(archiveId);
    switch (service) {
      case 'Google Photos':
        var credential = MdCloudServices.credentials.findOne({owner: userId, service: service});
        if (credential) {
          var accessToken = credential.credential.serviceData.accessToken;
          if (accessToken) {

            var photos = [];
            var client = new gPhotos(accessToken);
            // Get all the albumns
            // TODO: This process might need to be off loaded to a job server.
            client.getAlbums(Meteor.bindEnvironment(function (err, res) {
              var len = res.feed.entry.length;
              for (var x=0; x < len; x++) {
                var id = res.feed.entry[x].gphoto$id.$t;
                var album = {
                  name: res.feed.entry[x].gphoto$name.$t,
                  files: []
                }
                // Process albumns one at a time to lower server overhead
                Async.runSync(function (done) {
                  client.getAlbum(id, function (err, res) {
                    var len = res.feed.entry.length
                    for (var y=0; y < len; y++) {

                      var date = res.feed.entry[y].updated.$t;
                      var name = res.feed.entry[y].title.$t;
                      var url = res.feed.entry[y].content.src;
                      var type = 'img';
                      for (var v=0; v < res.feed.entry[y].media$group.media$content.length; v++) {
                        if (res.feed.entry[y].media$group.media$content[v].medium == 'video') {
                          url = res.feed.entry[y].media$group.media$content[v].url;
                          type = 'vid';
                        }
                      }
                      // Add this photo/video to the list
                      album.files.push({
                        name:   name,
                        url:    url,
                        type:   type,
                      });
                    }
                    photos.push(album);
                    done();
                  });
                });
              }
              MdArchive.addFileData(archiveId, photos);
              console.log('Archive Init Done: ' + archiveId);
            }));
          }
        }
        break;
    }
  }  
});