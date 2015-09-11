MdCloudServices.renewCredential = function (credential) {

  // This doesn't work.  There is more study require to making an off-line authorization.
  return {};
  
  var credentialDetail = OAuth.retrieveCredential(credential.credentialToken, credential.credentialSecret);
  MdCloudServices.credentials.update({_id: credential._id}, {$set: {credential: credentialDetail}});
  newCredential = MdCloudServices.credentials.findOne({_id: credential._id});

  return newCredential;
}

MdCloudServices.getAlbumns = function (service, accessToken, cb) {

  switch (service) {
    case 'Google Photos':
      var client = new gPhotos(accessToken);
      client.getAlbums(function (err, res) {
        var len = res.feed.entry.length;
        var albums = [];
        for (var x=0; x < len; x++) {
          albums.push({
            id: res.feed.entry[x].gphoto$id.$t,
            name: res.feed.entry[x].gphoto$name.$t
          });
        }
        cb(null, albums);
      });
      break;
  }

}