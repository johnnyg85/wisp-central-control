Future = Npm.require('fibers/future');

gPhotos = (function () {

  function gPhotos(token) {
    this.accessToken = token;
  };

  gPhotos.prototype.refreshAccessToken = function (refreshToken) {


    /*
    FROM: https://developers.google.com/oauthplayground

    POST /oauth2/v3/token HTTP/1.1
    Host: www.googleapis.com
    Content-length: 184
    content-type: application/x-www-form-urlencoded
    user-agent: google-oauth-playground
    client_secret=************&grant_type=refresh_token&refresh_token=1%2FhTI-gdlOvLFLEIC1LDYw5ElKnQGI4RRt14kXlKhNc6LBactUREZofsF9C7PrpE-j&client_id=407408718192.apps.googleusercontent.com
    */

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
      if (err) callback(err, res);
      callback(err, res.data);
    });
  };

  gPhotos.prototype.getAllAlbums = function () {
    var future = new Future();
    var albums = [];
    var _this = this;
    _this.getAlbums(function (err, res) {
      if (err) future.return(false);
      if (typeof res == 'string') {
        // didn't get the expected JSON object.
        console.log('Error in gPhotos.prototype.getAllAlbums: ' + res);
        future.return(false);
      }


      var len = res.feed.entry.length;
      for (var x=0; x < len; x++) {
        if (!res.feed.entry[x].gphoto$name.$t == 'InstantUpload') {
          albums.push({
            id: res.feed.entry[x].gphoto$id.$t,
            numPhotos: res.feed.entry[x].gphoto$numphotos.$t,
            name: res.feed.entry[x].gphoto$name.$t
          });
        }
      }
      _this.getInstantAlbums(function (err, res) {
        if (err) future.return(false);
        if (typeof res == 'string') {
          // didn't get the expected JSON object.
          console.log('Error in gPhotos.prototype.getAllAlbums: ' + res);
          future.return(false);
        }

        var len = res.feed.entry.length;
        for (var x=0; x < len; x++) {
          albums.push({
            id: res.feed.entry[x].gphoto$id.$t,
            numPhotos: res.feed.entry[x].gphoto$numphotos.$t,
            name: res.feed.entry[x].gphoto$name.$t
          });
        }
        //console.log(albums);
        future.return(albums);
      });
    });

    return future.wait();
  };



  gPhotos.prototype.getAlbums = function (callback) {
    this.getFeed('https://picasaweb.google.com/data/feed/api/user/default?kind=album&v=2&prettyprint=true&fields=openSearch:totalResults,entry(gphoto:id,gphoto:albumType,gphoto:numphotos,gphoto:name)', callback);
  };

  gPhotos.prototype.getInstantAlbums = function (callback) {
    this.getFeed('https://picasaweb.google.com/data/feed/api/user/default?kind=album&v=2&prettyprint=true&fields=openSearch:totalResults,entry(gphoto:id,gphoto:albumType,gphoto:numphotos,gphoto:name)&showall', callback);
  };

  gPhotos.prototype.getAlbum = function (albumId, startAt, max, callback) {
    var start = 1 + startAt;
    this.getFeed('https://picasaweb.google.com/data/feed/api/user/default/albumid/' + albumId + '?v=2&imgmax=d&start-index=' + start + '&max-results=' + max + '&fields=entry(title,updated,gphoto:size,media:group/media:content)', callback);
  };

  gPhotos.prototype.getRecent = function(callback) {
    this.getFeed('https://picasaweb.google.com/data/feed/api/user/default?kind=photo&v=2&max-results=5&feilds=entry/content/src', callback);
  };

  gPhotos.prototype.getQuota = function (callback) {
    this.getFeed('https://picasaweb.google.com/data/feed/api/user/default?v=2&feilds=feed/gphoto:quotacurrent', callback);
  };

  return gPhotos;
})();