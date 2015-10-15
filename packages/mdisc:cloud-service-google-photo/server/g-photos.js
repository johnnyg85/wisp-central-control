var gdata = Npm.require('simple-gdata');
var refresh = Npm.require('google-refresh-token');

gPhotos = (function () {

  function gPhotos(token) {
    this.accessToken = token;
    this._client = gdata(this.accessToken);
  };

  gPhotos.prototype.refreshAccessToken = function (refreshToken) {
    /*
    var reponse = Async.runSync(function (done) {
      refresh(refreshToken, Meteor.settings.google.clientId, Meteor.settings.google.secret, function (error, json, response) {
        console.log(json);
        done(error, json);
      });
    });

    if (response.error)
      throw Error(error);

    updateAccessToken(response.result);
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

  gPhotos.prototype.getFeed = function (feedURL, callback) {
      this._client.getFeed(feedURL, function (error, feeds) {
          callback(error, feeds);
      });
  };

  gPhotos.prototype.getAlbums = function (callback) {
    this.getFeed('https://picasaweb.google.com/data/feed/api/user/default', callback);
  };

  gPhotos.prototype.getAlbum = function (albumId, startAt, max, callback) {
    var start = 1 + startAt;
    this.getFeed('https://picasaweb.google.com/data/feed/api/user/default/albumid/' + albumId + '?imgmax=d&start-index=' + start + '&max-results=' + max + '&fields=entry(title,updated,gphoto:size,media:group/media:content)', callback);
  };

  gPhotos.prototype.getRecent = function(callback) {
    this.getFeed('https://picasaweb.google.com/data/feed/api/user/default?kind=photo&max-results=5&feilds=entry/content/src', callback);
  };

  gPhotos.prototype.getQuota = function (callback) {
    this.getFeed('https://picasaweb.google.com/data/feed/api/user/default?feilds=feed/gphoto:quotacurrent', callback);
  };

  return gPhotos;
})();