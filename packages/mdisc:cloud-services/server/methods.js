Future = Npm.require('fibers/future');

Meteor.methods({
  addCredential: function(service, credentialToken, credentialSecret) {
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
          var len = res.feed.entry.length;
          var urls = [];
          for (var x = 0; x < len; x++) {
            //console.log(res.feed.entry[x].content.src);
            urls.push(res.feed.entry[x].content.src);
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
  // No longer used.  This functionality has been moved to the Download Server
  initAutoCloudArchive: function(service, archiveId) {
    // Get all the files to be used in the archive
    console.log(archiveId);
    var credential = MdCloudServices.credentials.findOne({owner: this.userId, service: service});
    if (!credential) {
      throw new Meteor.Error('init-archive', 'No credentials found.');
    }

    switch (service) {
      case 'Google Photos':
        // Run this on another fiber so that the server can reply to other method calls.
        Meteor.setTimeout(Meteor.bindEnvironment(function () {
          var photos = [];
          var count = 0;
          var gSize = 1000; // max 1000
          var client = new gPhotos(credential);

          // Get all the albumns
          // TODO: This process might need to be off loaded to a job server.
          var albums = client.getAllAlbums();
          if (!albums) return false;  // TODO: restart the init process


          //console.log(albums);
          var estimatedSize = 0;
          var len = albums.length;
          for (var x=0; x < len; x++) {
            var id = albums[x].id;
            var numPhotos = albums[x].numPhotos;
            var groups = Math.floor((Number(numPhotos) + gSize) / gSize);

            // break albums into smaller sub groups
            // max is groups of 1000
            for (var g = 0; g < groups; g++) {
              var aName = albums[x].name;
              if (groups > 1) {
                var tag = (g + 1) * gSize;
                aName = aName + '-' + tag;
              }
              var album = {
                name: aName,
                files: []
              }

              var index = g * gSize;

              // TODO: Find a solution to getting indexs over 10,000
              // Error from Google: Deprecated offset is too large for a stream ID query. Please  switch to using resume tokens.
              if (index < 10000) {
                // Process albumns one at a time to lower server overhead
                Async.runSync(function (done) {
                  client.getAlbum(id, g * gSize, gSize, function (err, res) {
                    if (err) {
                      // try again
                      console.log('Error Getting Album: ' + err);
                      g--;
                      done();
                      return;
                    }
                    if (typeof res == 'string') {
                      // didn't get the expected JSON object.
                      console.log('Error in initAutoCloudArchive (album): ' + res);
                      done();
                      return;
                    }
                    var len = res.feed.entry.length
                    for (var y=0; y < len; y++) {

                      //console.log(res.feed.entry[y]);
                      //console.log(res.feed.entry[y].media$group.media$content);
                      //console.log('-----------------------------------------------------------------------------');

                      var date = res.feed.entry[y].updated.$t;
                      var name = res.feed.entry[y].title.$t;
                      var url = res.feed.entry[y].media$group.media$content[0].url;
                      var type = 'img';


                      var size = res.feed.entry[y].gphoto$size.$t;
                      estimatedSize += Number(size);

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
                      count++;
                    }
                    photos.push(album);
                    done();
                  });
                }); // Async.runSync
              } // end if < 10000
            } // for groups
          } // for album
          MdArchive.addFileData(archiveId, photos, estimatedSize);
          console.log('Archive Init Done: ' + archiveId);
          console.log('Estimated Size: ' + estimatedSize);
          console.log('Photos/Videos: ' + count);
        }), 1000); // end timeout
        break;
    }
  },
  mdCloudServiceIsConnected: function (service) {
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