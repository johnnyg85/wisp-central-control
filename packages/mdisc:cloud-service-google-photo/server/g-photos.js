var gdata = Npm.require('simple-gdata');
var refresh = Npm.require('google-refresh-token');

gPhotos = (function () {
  var _client = {};
  var accessToken = '';

  var setAccessToken = function (token) {
    accessToken = token;
    _client = gdata(accessToken);
  };

  var refreshAccessToken = function (refreshToken) {
    var reponse = Async.runSync(function (done) {
      refresh(refreshToken, Meteor.settings.google.clientId, Meteor.settings.google.secret, function (error, json, response) {
        console.log(json);
        done(error, json);
      });
    });

    if (response.error)
      throw Error(error);

    updateAccessToken(response.result);
  };

  var updateAccessToken = function (json) {
    console.log(json);
    if (json.accessToken) {
      setAccessToken(json.accessToken);
    }
  };

  var getFeed = function (feedURL, callback) {
            _client.getFeed(feedURL, function (error, feeds) {
                callback(error, feeds);
            });
  };

  var getAlbums = function (callback) {
    getFeed('https://picasaweb.google.com/data/feed/api/user/default', callback);
  };

  var getAlbum = function (albumId, callback) {
    getFeed('https://picasaweb.google.com/data/feed/api/user/default/albumid/' + albumId, callback);
  };

  var getRecent = function(callback) {
    getFeed('https://picasaweb.google.com/data/feed/api/user/default?kind=photo&max-results=5', callback);
  };

  var jingle = function () {
    return "Bells";
  };

  return {
    setAccessToken: setAccessToken,
    refreshAccessToken: refreshAccessToken,
    updateAccessToken: updateAccessToken,
    getAlbums: Async.wrap(getAlbums),
    getAlbum: getAlbum,
    getRecent: getRecent,
    jingle: jingle
  };
})();