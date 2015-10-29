Future = Npm.require('fibers/future');

gPhotos = (function () {

  function gPhotos(serviceData) {
    this.accessToken = serviceData.accessToken;
    this.idToken = serviceData.idToken;
    this.expiresAt = serviceData.expiresAt;
    this.refreshToken = serviceData.refreshToken;
  };

  gPhotos.prototype.refreshAccessToken = function () {


    /*
    FROM: https://developers.google.com/oauthplayground

    POST /oauth2/v3/token HTTP/1.1
    Host: www.googleapis.com
    Content-length: 184
    content-type: application/x-www-form-urlencoded
    user-agent: google-oauth-playground
    client_secret=************&grant_type=refresh_token&refresh_token=1%2FhTI-gdlOvLFLEIC1LDYw5ElKnQGI4RRt14kXlKhNc6LBactUREZofsF9C7PrpE-j&client_id=407408718192.apps.googleusercontent.com
    */
   
    try {
      var result = Meteor.http.call("POST", "https://accounts.google.com/o/oauth2/token", {
        params: {
          'client_id': Meteor.settings.google.clientId,
          'client_secret': Meteor.settings.google.secret,
          'refresh_token': this.refreshToken,
          'grant_type': 'refresh_token'
        }
      });
    } catch (e) {
      var code = e.response ? e.response.statusCode : 500;
      throw new Meteor.Error(code, 'Unable to exchange google refresh token..', e.response)
    }
    
    if (result.statusCode === 200) {
      return result.data;
    } else {
      throw new Meteor.Error(result.statusCode, 'Unable to exchange google refresh token.', result);
    }

  };

  gPhotos.prototype.updateAccessToken = function (json) {
    /*
    console.log(json);
    if (json.accessToken) {
      setAccessToken(json.accessToken);
    }
    */
  };

  gPhotos.prototype.getFeed = function (url, callback) {
    console.log(url);
    var options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'GData-Version': '2',
        'Authorization': 'Bearer ' + this.accessToken     
      }
    };

    if(url.lastIndexOf('alt=json') == -1) {
      if(url.lastIndexOf('?') > -1) {
        url += '&alt=json';
      } else {
        url += '?alt=json';
      }
    }    

    HTTP.get(url, options, function (err, res) {
      //console.log(err);
      if (err) {
        callback(err, res);
        return;
      }
      callback(err, res.data);
    });
  };

  gPhotos.prototype.getAllAlbums = function () {
    var future = new Future();
    var albums = [];
    var _this = this;

    _this.getDetailedAlbums(function (err, res) {
      if (err) future.return(false);
      if (typeof res == 'string') {
        // didn't get the expected JSON object.
        console.log('Error in gPhotos.prototype.getAllAlbums: ' + res);
        future.return(false);
      }

      var count = 0;

      var len = res.feed.entry.length;
      for (var x=0; x < len; x++) {
        count += res.feed.entry[x].gphoto$numphotos.$t;
        if (res.feed.entry[x].gphoto$numphotos.$t != 0) {
          albums.push({
            id: res.feed.entry[x].gphoto$id.$t,
            numPhotos: res.feed.entry[x].gphoto$numphotos.$t,
            name: res.feed.entry[x].gphoto$name.$t
          });
        }
      }
      console.log('Photos Reported (All Albums): ' + count);
      //console.log(albums);
      future.return(albums);
    });

    return future.wait();
  };



  gPhotos.prototype.getRecent = function(callback) {
    
    var recent;
    var _this = this;
    var _callback = callback;

    // First check if the account has standard recent photos
    _this.getFeed('https://picasaweb.google.com/data/feed/api/user/default?kind=photo&v=2&max-results=5&feilds=entry/content/src', function (err, res) {
      if (!err) {
        // We have normal recent photos
        _callback(err, res);
        return;
      }

      //  Well, let's just get something...
      _this.getAlbums(function (err, res) {
        var albumId;
        if (err) {
          _callback(err, res);
          return;
        }
        if (typeof res == 'string') {
          // didn't get the expected JSON object.
          console.log('Error in gPhotos.prototype.getAllAlbums: ' + res);
          _callback(true, res);
          return;
        }
        var len = res.feed.entry.length;
        for (var x=0; x < len; x++) {
          if (res.feed.entry[x].gphoto$name.$t == 'InstantUpload' || x == 0) {
            albumId = res.feed.entry[x].gphoto$id.$t;
          }
        }
        _this.getFeed('https://picasaweb.google.com/data/feed/api/user/default/albumid/' + albumId + '?kind=photo&v=2&max-results=5&feilds=entry/content/src', _callback);
      });
    });

  };


  gPhotos.prototype.getAlbums = function (callback) {
    this.getFeed('https://picasaweb.google.com/data/feed/api/user/default?kind=album&v=2&fields=openSearch:totalResults,entry(gphoto:id,gphoto:albumType,gphoto:numphotos,gphoto:name)', callback);
  };

  gPhotos.prototype.getDetailedAlbums = function (callback) {
    this.getFeed('https://picasaweb.google.com/data/feed/api/user/default?kind=album&v=2&fields=openSearch:totalResults,entry(gphoto:id,gphoto:albumType,gphoto:numphotos,gphoto:name)&showall', callback);
  };

  gPhotos.prototype.getAlbum = function (albumId, startAt, max, callback) {
    var start = 1 + startAt;
    this.getFeed('https://picasaweb.google.com/data/feed/api/user/default/albumid/' + albumId + '?v=2&imgmax=d&start-index=' + start + '&max-results=' + max + '&fields=entry(title,updated,gphoto:size,media:group/media:content)', callback);
  };


  gPhotos.prototype.getQuota = function (callback) {
    this.getFeed('https://picasaweb.google.com/data/feed/api/user/default?v=2&feilds=feed/gphoto:quotacurrent', callback);
  };

  return gPhotos;
})();